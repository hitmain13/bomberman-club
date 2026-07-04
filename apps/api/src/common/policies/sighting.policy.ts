import type { Role } from "@prisma/client";

export interface AuthSubject {
  id: string;
  role: Role;
}

export function canManageSighting(viewer: AuthSubject, ownerId: string): boolean {
  return viewer.id === ownerId || viewer.role === "ADMIN";
}
