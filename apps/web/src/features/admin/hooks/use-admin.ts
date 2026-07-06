"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/shared/contexts/auth-context";
import { apiClient } from "@/shared/lib/api-client";

export function useAdminUploads() {
  const { isAuthenticated, isLoading } = useAuth();
  return useQuery({
    queryKey: ["admin", "uploads"],
    queryFn: () => apiClient.admin.listUploads(50),
    staleTime: 30_000,
    enabled: isAuthenticated && !isLoading,
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
  const { isAuthenticated, isLoading } = useAuth();
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => apiClient.admin.listUsers(50),
    staleTime: 30_000,
    enabled: isAuthenticated && !isLoading,
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
