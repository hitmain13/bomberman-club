"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/shared/contexts/auth-context";

import type { RegisterFormValues } from "../schemas";

export function useRegister() {
  const { signUp } = useAuth();
  const router = useRouter();
  return useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      await signUp(values.username, values.email, values.password);
    },
    onSuccess: () => {
      router.replace("/feed");
    },
  });
}
