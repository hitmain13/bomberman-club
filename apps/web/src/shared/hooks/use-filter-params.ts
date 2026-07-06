"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { z } from "zod";

export function parseEnumParam<T extends string>(
  value: string | null,
  schema: z.ZodType<T>,
  fallback: T,
): T {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : fallback;
}

export function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const setParam = useCallback(
    (key: string, value: string | null | undefined, defaultValue?: string) => {
      replaceParams((params) => {
        if (!value || value === defaultValue) {
          params.delete(key);
          return;
        }
        params.set(key, value);
      });
    },
    [replaceParams],
  );

  return useMemo(
    () => ({
      searchParams,
      replaceParams,
      setParam,
    }),
    [replaceParams, searchParams, setParam],
  );
}
