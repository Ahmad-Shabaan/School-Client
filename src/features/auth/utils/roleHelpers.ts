import type { Role } from "@/shared/types/common.types";

export const hasRole = (userRoles: readonly Role[], role: Role): boolean =>
  userRoles.includes(role);

export const hasAnyRole = (userRoles: readonly Role[], roles: readonly Role[]): boolean =>
  roles.some((role) => userRoles.includes(role));

export const hasAllRoles = (userRoles: readonly Role[], roles: readonly Role[]): boolean =>
  roles.every((role) => userRoles.includes(role));
