"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/shared/contexts/auth-context";

import type { LoginFormValues } from "../schemas";

export function useLogin() {
  const { signIn } = useAuth();
  const router = useRouter();
  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      await signIn(values.identifier, values.password);
    },
    onSuccess: () => {
      router.replace("/feed");
    },
  });
}
