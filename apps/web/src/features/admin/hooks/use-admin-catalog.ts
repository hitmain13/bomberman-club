"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/shared/lib/api-client";

export function useAdminCatalogCategories() {
  return useQuery({
    queryKey: ["admin", "catalog", "categories"],
    queryFn: () => apiClient.admin.listCatalogCategories(),
    staleTime: 30_000,
  });
}

export function useAdminCatalogParts(categoryId: string) {
  return useQuery({
    queryKey: ["admin", "catalog", "parts", categoryId],
    queryFn: () => apiClient.admin.listCatalogParts(categoryId),
    enabled: categoryId.length > 0,
    staleTime: 30_000,
  });
}

export function useAdminCatalogSpecs() {
  return useQuery({
    queryKey: ["admin", "catalog", "specs"],
    queryFn: () => apiClient.admin.listCatalogSpecs(),
    staleTime: 30_000,
  });
}

export function useAdminCatalogMutations() {
  const queryClient = useQueryClient();
  const invalidate = (): void => {
    queryClient.invalidateQueries({ queryKey: ["admin", "catalog"] });
  };

  return {
    createCategory: useMutation({
      mutationFn: (input: { slug: string; name: string }) =>
        apiClient.admin.createCatalogCategory(input),
      onSuccess: invalidate,
    }),
    deleteCategory: useMutation({
      mutationFn: (id: string) => apiClient.admin.deleteCatalogCategory(id),
      onSuccess: invalidate,
    }),
    createPart: useMutation({
      mutationFn: (input: { categoryId: string; manufacturer: string; name: string }) =>
        apiClient.admin.createCatalogPart(input),
      onSuccess: invalidate,
    }),
    deletePart: useMutation({
      mutationFn: (id: string) => apiClient.admin.deleteCatalogPart(id),
      onSuccess: invalidate,
    }),
    createSpec: useMutation({
      mutationFn: (input: {
        key: string;
        name: string;
        type: string;
        unit?: string | null;
        category?: string | null;
      }) => apiClient.admin.createCatalogSpec(input),
      onSuccess: invalidate,
    }),
    deleteSpec: useMutation({
      mutationFn: (id: string) => apiClient.admin.deleteCatalogSpec(id),
      onSuccess: invalidate,
    }),
  };
}
