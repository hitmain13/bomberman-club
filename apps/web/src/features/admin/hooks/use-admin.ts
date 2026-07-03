"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";

export function useAdminUploads() {
  return useQuery({
    queryKey: ["admin", "uploads"],
    queryFn: () => apiClient.admin.listUploads(50),
    staleTime: 30_000,
  });
}

export function useDeleteUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.admin.deleteUpload(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "uploads"] });
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => apiClient.admin.listUsers(50),
    staleTime: 30_000,
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.admin.banUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.admin.unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
