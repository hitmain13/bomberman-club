"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUploadImage } from "@/shared/hooks/use-upload-image";
import { apiClient } from "@/shared/lib/api-client";
import { queryKeys } from "@/shared/lib/query-keys";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const upload = useUploadImage();

  return useMutation({
    mutationFn: async (file: File) => {
      const uploaded = await upload.mutateAsync(file);
      return apiClient.users.updateMe({ avatarUploadId: uploaded.id });
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me(), user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byUsername(user.username) });
    },
  });
}
