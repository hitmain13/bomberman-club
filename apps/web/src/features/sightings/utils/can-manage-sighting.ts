import type { PrivateUser } from "@bomberman/types";

export function canManageSighting(user: PrivateUser | null, ownerId: string): boolean {
  if (!user) {
    return false;
  }
  return user.id === ownerId || user.role === "ADMIN";
}
