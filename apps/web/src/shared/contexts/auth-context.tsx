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
import { refreshSession, refreshSessionWithRetry } from "@/shared/lib/refresh-session";
import {
  clearPersistedSession,
  persistSession,
  readPersistedSession,
  readPersistedUserSnapshot,
} from "@/shared/lib/session-persistence";

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
  const queryClient = useQueryClient();

  const applySession = useCallback(
    (session: { user: PrivateUser; accessToken: string; expiresIn?: number }) => {
      setAccessToken(session.accessToken);
      setUser(session.user);
      persistSession({
        user: session.user,
        accessToken: session.accessToken,
        expiresIn: session.expiresIn ?? 900,
      });
      queryClient.setQueryData(queryKeys.auth.me(), session.user);
    },
    [queryClient],
  );

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    clearPersistedSession();
    queryClient.removeQueries({ queryKey: queryKeys.auth.me() });
  }, [queryClient]);

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
      return session.accessToken;
    });

    void (async () => {
      const validSession = readPersistedSession();
      if (validSession) {
        setAccessToken(validSession.accessToken);
        setUser(validSession.user);
        queryClient.setQueryData(queryKeys.auth.me(), validSession.user);
        setIsLoading(false);
        isBootstrappingRef.current = false;
        return;
      }

      const snapshot = readPersistedUserSnapshot();
      if (snapshot) {
        setAccessToken(snapshot.accessToken);
        setUser(snapshot.user);
        queryClient.setQueryData(queryKeys.auth.me(), snapshot.user);
      }

      setIsLoading(false);
      isBootstrappingRef.current = false;

      if (cancelled) {
        return;
      }

      const session = await refreshSessionWithRetry();
      if (cancelled) {
        return;
      }

      if (session) {
        applySession(session);
        return;
      }

      if (snapshot) {
        clearSession();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applySession, clearSession, queryClient]);

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
      queryClient.setQueryData(queryKeys.auth.me(), nextUser);
      const snapshot = readPersistedUserSnapshot();
      if (snapshot) {
        persistSession({
          user: nextUser,
          accessToken: snapshot.accessToken,
          expiresIn: 900,
        });
      }
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
