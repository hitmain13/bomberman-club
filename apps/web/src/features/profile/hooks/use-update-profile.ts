"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

import type { EditProfileValues } from "../schemas";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (values: EditProfileValues) => {
      return apiClient.users.updateMe({
        username: values.username,
        bio: values.bio ?? null,
        city: values.city ?? null,
      });
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me(), user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byUsername(user.username) });
      router.replace("/me");
    },
  });
}
