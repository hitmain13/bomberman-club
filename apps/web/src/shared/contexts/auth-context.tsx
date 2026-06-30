"use client";

import type { PrivateUser } from "@bomberman/types";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { apiClient } from "@/shared/lib/api-client";
import { onUnauthorized, setAccessToken } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

interface AuthContextValue {
  user: PrivateUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<PrivateUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const applySession = useCallback(
    (session: { user: PrivateUser; accessToken: string }) => {
      setAccessToken(session.accessToken);
      setUser(session.user);
      queryClient.setQueryData(queryKeys.auth.me(), session.user);
    },
    [queryClient],
  );

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    queryClient.removeQueries({ queryKey: queryKeys.auth.me() });
  }, [queryClient]);

  useEffect(() => {
    let cancelled = false;
    onUnauthorized(() => clearSession());
    void (async () => {
      try {
        const session = await apiClient.auth.refresh();
        if (!cancelled) {
          applySession(session);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applySession, clearSession]);

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

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      signIn,
      signUp,
      signOut,
    }),
    [user, isLoading, signIn, signUp, signOut],
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
