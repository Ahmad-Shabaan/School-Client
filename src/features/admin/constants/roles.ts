export const ROLES = {
  Admin: "Admin",
  PreAdmin: "PreAdmin",
  Teacher: "Teacher",
  Student: "Student",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES]; // "Admin" | "PreAdmin" | ...

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.Admin]: ["users:read", "users:write", "roles:assign", "roles:remove"],
  [ROLES.PreAdmin]: ["users:read", "users:write"],
  [ROLES.Teacher]: ["users:read"],
  [ROLES.Student]: ["users:read"],
};
