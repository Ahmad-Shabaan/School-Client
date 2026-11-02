import { ROLES } from "@/config/constants";

export const ROUTES = {
  [ROLES.Admin]: {
    basePath: "/admin",
    dashboard: "dashboard",
    courses: "courses",
    course: "courses/:id",
    lesson: "lessons/:id",
    members: "members",
    member: "members/:id",
    subscriptions:"subscriptions",
    chat: "chat",
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
    courses: "courses",
    course: "courses/:id",
    coursePosts: "courses/:courseId/posts",
    coursePost: "courses/:courseId/posts/:postId",
    lesson: "lessons/:id",
    quiz: "lessons/:id/quiz",
    chat: "chat",
    roles: [ROLES.Student]
  },
} as const;

const STUDENT_BASE_PATH = ROUTES[ROLES.Student].basePath;

export const studentCoursePath = (courseId: number | string) =>
  `${STUDENT_BASE_PATH}/courses/${courseId}`;

export const studentCoursePostsPath = (courseId: number | string) =>
  `${studentCoursePath(courseId)}/posts`;

export const studentCoursePostPath = (
  courseId: number | string,
  postId: number | string,
) => `${studentCoursePostsPath(courseId)}/${postId}`;

export const studentChatPath = () => `${STUDENT_BASE_PATH}/chat`;

export const adminChatPath = (
  conversationId?: number | string,
) =>
  conversationId == null
    ? `${ROUTES[ROLES.Admin].basePath}/chat`
    : `${ROUTES[ROLES.Admin].basePath}/chat/${conversationId}`;
