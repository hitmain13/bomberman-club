import type { PrivateUser } from "@bomberman/types";
import type { User } from "@prisma/client";

export function toPrivateUser(user: User, avatarUrl: string | null): PrivateUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    bio: user.bio,
    city: user.city,
    avatarUrl,
    createdAt: user.createdAt.toISOString(),
  };
}
