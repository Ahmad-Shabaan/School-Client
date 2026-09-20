import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import MemberDetails from "@/features/admin/pages/MemberDetails";
import RoleRoute from "@/components/guards/RoleRoute";
import { ROLES } from "@/config/constants";
import TeacherPanel from "@/features/teacher/pages/TeacherPanel";
import AdminPanel from "@/features/supervisor/pages/SupervisorPanel";
import AccessDenied from "@/shared/pages/AccessDenied";
import AdminPanelLayout from "@/features/admin/layout/AdminPanelLayout";
import Members from "@/features/admin/pages/Members";
import StudentProfile from "@/features/student/pages/StudentProfile";
import { ROUTES } from "@/config/routes";
import ServerError from "@/shared/pages/ServerError";
import Courses from "@/features/admin/pages/Courses";
import CourseDetails from "@/features/admin/pages/CourseDetails";
import Subscriptions from "@/features/admin/pages/Subscriptions";
import Home from "@/landing/pages/Home";

const PrivateRoute = lazy(() => import("../components/guards/PrivateRoute"));
const PublicOnlyRoute = lazy(
  () => import("../components/guards/PublicOnlyRoute"),
);
const AuthLayout = lazy(() => import("@/features/auth/layouts/AuthLayout"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
// const AppLayout = lazy(() => import("@/shared/components/layout/AppLayout"));
const ForgetPassword = lazy(
  () => import("@/features/auth/pages/ForgetPassword"),
);
const ResetPassword = lazy(() => import("@/features/auth/pages/ResetPassword"));
const ChangePasswordPage = lazy(
  () => import("@/features/auth/pages/ChangePasswordPage"),
);
const Dashboard = lazy(() => import("@/features/admin/pages/Dashboard"));
const NotFound = lazy(() => import("@/shared/pages/NotFound"));

const router = createBrowserRouter([
  {
    // PublicOnlyRoute: Logged in users trying to access login will be redirected to /library
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <StudentProfile />,
      },
      {
        path: "/login",
        element: <AuthLayout />,
        children: [{ index: true, element: <LoginPage /> }],
      },
      {
        path: "/forgot-password",
        element: <ForgetPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/change-password",
        element: <ChangePasswordPage />,
      },
    ],
  },
  {
    // RoleRoute for Admin only
    element: <RoleRoute roles={ROUTES[ROLES.Admin].roles} />,
    children: [
      {
        path: ROUTES.Admin.basePath,
        element: <AdminPanelLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: ROUTES.Admin.dashboard,
            element: <Dashboard />,
          },
          {
            path: ROUTES.Admin.courses,
            element: <Courses />,
          },
          {
            path: ROUTES.Admin.course,
            element: <CourseDetails />,
          },
          {
            path: ROUTES.Admin.members,
            element: <Members />,
          },
          {
            path: ROUTES.Admin.member,
            element: <MemberDetails />,
          },
          {
            path: ROUTES.Admin.subscriptions,
            element: <Subscriptions />,
          },
        ],
      },
    ],
  },
  {
    // RoleRoute for Admin only
    element: <RoleRoute roles={ROUTES[ROLES.PreAdmin].roles} />,
    children: [
      {
        path: ROUTES.PreAdmin.basePath,
        element: <AdminPanel />,
      },
    ],
  },
  {
    // RoleRoute for Sub-Admin or Admin
    element: <RoleRoute roles={ROUTES[ROLES.Teacher].roles} />,
    children: [
      {
        path: ROUTES.Teacher.basePath,
        element: <TeacherPanel />,
      },
    ],
  },
  {
    // RoleRoute for Student
    element: <RoleRoute roles={ROUTES[ROLES.Student].roles} />,
    children: [
      {
        path: ROUTES.Student.basePath,
        element: <StudentProfile />,
      },
    ],
  },
  {
    path: "/server-error",
    element: <ServerError />, // Catch-all 500
  },
  {
    path: "/access-denied",
    element: <AccessDenied />, // Catch-all 403
  },
  {
    path: "*",
    element: <NotFound />, // Catch-all 404
  },
]);

export default router;
