"use client";

import type { PrivateUser } from "@bomberman/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  apiClient,
  onUnauthorized,
  setAccessToken,
  setRefreshAccessToken,
} from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";
import {
  refreshSession,
  refreshSessionWithRetry,
  scheduleBackgroundRefreshRetry,
} from "@/shared/lib/refresh-session";
import { clearUserCache, persistUserCache, readUserCache } from "@/shared/lib/session-persistence";

interface AuthContextValue {
  user: PrivateUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: (user: PrivateUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<PrivateUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isBootstrappingRef = useRef(true);
  const refreshTimerRef = useRef<number | null>(null);
  const backgroundRetryRef = useRef<number | null>(null);
  const applySessionRef = useRef<
    (session: {
      user: PrivateUser;
      accessToken: string;
      expiresIn?: number;
    }) => void
  >(() => undefined);
  const queryClient = useQueryClient();

  const clearBackgroundRetry = useCallback(() => {
    if (backgroundRetryRef.current) {
      window.clearTimeout(backgroundRetryRef.current);
      backgroundRetryRef.current = null;
    }
  }, []);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const applySession = useCallback(
    (session: { user: PrivateUser; accessToken: string; expiresIn?: number }) => {
      setAccessToken(session.accessToken || null);
      setUser(session.user);
      persistUserCache(session.user);
      queryClient.setQueryData(queryKeys.auth.me(), session.user);
      clearBackgroundRetry();

      clearRefreshTimer();
      const expiresIn = session.expiresIn ?? 900;
      const delayMs = Math.max(30_000, expiresIn * 1000 - 120_000);
      refreshTimerRef.current = window.setTimeout(() => {
        void refreshSession().then((next) => {
          if (next) {
            applySessionRef.current(next);
            return;
          }
          backgroundRetryRef.current = scheduleBackgroundRefreshRetry(() => {
            void refreshSession().then((retry) => {
              if (retry) {
                applySessionRef.current(retry);
              }
            });
          });
        });
      }, delayMs);
    },
    [clearBackgroundRetry, clearRefreshTimer, queryClient],
  );

  applySessionRef.current = applySession;

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    clearRefreshTimer();
    clearBackgroundRetry();
    clearUserCache();
    queryClient.removeQueries({ queryKey: queryKeys.auth.me() });
  }, [clearBackgroundRetry, clearRefreshTimer, queryClient]);

  const restoreSession = useCallback(async (): Promise<boolean> => {
    const session = await refreshSessionWithRetry();
    if (session) {
      applySession(session);
      return true;
    }
    return false;
  }, [applySession]);

  useEffect(() => {
    let cancelled = false;
    isBootstrappingRef.current = true;

    onUnauthorized(() => {
      if (!isBootstrappingRef.current) {
        clearSession();
      }
    });

    setRefreshAccessToken(async () => {
      const session = await refreshSession();
      if (cancelled || !session) {
        return null;
      }
      applySession(session);
      return session.accessToken || "cookie";
    });

    const cachedUser = readUserCache();
    if (cachedUser) {
      setUser(cachedUser);
      queryClient.setQueryData(queryKeys.auth.me(), cachedUser);
    }

    void (async () => {
      const restored = await restoreSession();
      if (cancelled) {
        return;
      }
      if (!restored && cachedUser) {
        backgroundRetryRef.current = scheduleBackgroundRefreshRetry(() => {
          void restoreSession();
        });
      }
      if (!restored && !cachedUser) {
        clearSession();
      }
      setIsLoading(false);
      isBootstrappingRef.current = false;
    })();

    const handleVisibility = (): void => {
      if (document.visibilityState !== "visible" || cancelled) {
        return;
      }
      void refreshSession().then((session) => {
        if (session) {
          applySession(session);
        }
      });
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      clearRefreshTimer();
      clearBackgroundRetry();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [
    applySession,
    clearBackgroundRetry,
    clearRefreshTimer,
    clearSession,
    queryClient,
    restoreSession,
  ]);

  const signIn = useCallback(
    async (identifier: string, password: string) => {
      const session = await apiClient.auth.login({ identifier, password });
      applySession(session);
    },
    [applySession],
  );

  const signUp = useCallback(
    async (username: string, email: string, password: string) => {
      const session = await apiClient.auth.register({ username, email, password });
      applySession(session);
    },
    [applySession],
  );

  const signOut = useCallback(async () => {
    try {
      await apiClient.auth.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const refreshUser = useCallback(
    (nextUser: PrivateUser) => {
      setUser(nextUser);
      persistUserCache(nextUser);
      queryClient.setQueryData(queryKeys.auth.me(), nextUser);
    },
    [queryClient],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      signIn,
      signUp,
      signOut,
      refreshUser,
    }),
    [user, isLoading, signIn, signUp, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
