import {
  type AuthResponse,
  type LoginInput,
  type RegisterInput,
  authResponseSchema,
  loginInputSchema,
  registerInputSchema,
} from "@bomberman/types";
import { z } from "zod";

import type { HttpClient } from "../http";

export class AuthResource {
  constructor(private readonly http: HttpClient) {}

  register(input: RegisterInput): Promise<AuthResponse> {
    const body = registerInputSchema.parse(input);
    return this.http.request({
      method: "POST",
      path: "/auth/register",
      body,
      responseSchema: authResponseSchema,
    });
  }

  login(input: LoginInput): Promise<AuthResponse> {
    const body = loginInputSchema.parse(input);
    return this.http.request({
      method: "POST",
      path: "/auth/login",
      body,
      responseSchema: authResponseSchema,
    });
  }

  refresh(): Promise<AuthResponse> {
    return this.http.request({
      method: "POST",
      path: "/auth/refresh",
      responseSchema: authResponseSchema,
    });
  }

  session(): Promise<AuthResponse> {
    return this.http.request({
      method: "GET",
      path: "/auth/session",
      responseSchema: authResponseSchema,
    });
  }

  logout(): Promise<{ ok: boolean }> {
    return this.http.request({
      method: "POST",
      path: "/auth/logout",
      responseSchema: z.object({ ok: z.boolean() }),
    });
  }
}
