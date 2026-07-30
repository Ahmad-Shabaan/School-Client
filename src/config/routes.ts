import { ROLES } from "@/config/constants";

export const ROUTES = {
  [ROLES.Admin]: {
    basePath: "/admin",
    dashboard: "dashboard",
    courses: "courses",
    course: "courses/id",
    members: "members",
    member: "members/:id",
    subscriptions:"subscriptions",
    roles: [ROLES.Admin],
  },

  [ROLES.PreAdmin]: {
    basePath: "/supervisor",
    dashboard: "supervisor",
    roles: [ROLES.PreAdmin],
  },

  [ROLES.Teacher]: {
    basePath: "/teacher",
    dashboard: "teacher",
    roles: [ROLES.Teacher],
  },

  [ROLES.Student]: {
    basePath: "/student",
    dashboard: "student",
    roles: [ROLES.Student],
  },
} as const;
