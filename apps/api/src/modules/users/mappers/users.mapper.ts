import type { PrivateUser, PublicUser } from "@bomberman/types";
import type { User } from "@prisma/client";

export function toPublicUser(user: User, avatarUrl: string | null): PublicUser {
  return {
    id: user.id,
    username: user.username,
    bio: user.bio,
    city: user.city,
    avatarUrl,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toPrivateUser(user: User, avatarUrl: string | null): PrivateUser {
  return {
    ...toPublicUser(user, avatarUrl),
    email: user.email,
    role: user.role,
  };
}
