"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/shared/contexts/auth-context";
import { useUploadImage } from "@/shared/hooks/use-upload-image";
import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

import type { EditProfileValues } from "../schemas";

export interface UpdateProfileInput {
  values: EditProfileValues;
  avatarFile?: File | null;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const upload = useUploadImage();

  return useMutation({
    mutationFn: async ({ values, avatarFile }: UpdateProfileInput) => {
      let avatarUploadId: string | undefined;
      if (avatarFile) {
        const uploaded = await upload.mutateAsync(avatarFile);
        avatarUploadId = uploaded.id;
      }

      return apiClient.users.updateMe({
        username: values.username,
        bio: values.bio ?? null,
        city: values.city ?? null,
        ...(avatarUploadId ? { avatarUploadId } : {}),
      });
    },
    onSuccess: (user) => {
      refreshUser(user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byUsername(user.username) });
      router.replace("/me");
    },
  });
}
