"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/shared/contexts/auth-context";

import type { LoginFormValues } from "../schemas";

function resolveRedirectTarget(redirect: string | null): string {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return "/feed";
  }
  return redirect;
}

export function useLogin() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      await signIn(values.identifier, values.password);
    },
    onSuccess: () => {
      router.replace(resolveRedirectTarget(redirect));
    },
  });
}
