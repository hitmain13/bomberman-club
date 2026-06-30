import {
  type PrivateUser,
  type PublicUser,
  privateUserSchema,
  publicUserSchema,
} from "@bomberman/types";
import { z } from "zod";

import type { HttpClient } from "../http";

const updateMeSchema = z.object({
  username: z.string().min(3).max(24).optional(),
  bio: z.string().max(280).nullable().optional(),
  city: z.string().max(80).nullable().optional(),
  avatarUploadId: z.string().nullable().optional(),
});

export type UpdateMeInput = z.infer<typeof updateMeSchema>;

export class UsersResource {
  constructor(private readonly http: HttpClient) {}

  me(): Promise<PrivateUser> {
    return this.http.request({
      path: "/users/me",
      responseSchema: privateUserSchema,
    });
  }

  byUsername(username: string): Promise<PublicUser> {
    return this.http.request({
      path: `/users/${encodeURIComponent(username)}`,
      responseSchema: publicUserSchema,
    });
  }

  updateMe(input: UpdateMeInput): Promise<PrivateUser> {
    const body = updateMeSchema.parse(input);
    return this.http.request({
      method: "PATCH",
      path: "/users/me",
      body,
      responseSchema: privateUserSchema,
    });
  }
}
