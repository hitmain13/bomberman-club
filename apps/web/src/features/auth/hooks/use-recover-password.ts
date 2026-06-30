"use client";

import { useMutation } from "@tanstack/react-query";

import type { RecoverFormValues } from "../schemas";

export function useRecoverPassword() {
  return useMutation({
    mutationFn: async (values: RecoverFormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return { sentTo: values.email };
    },
  });
}
