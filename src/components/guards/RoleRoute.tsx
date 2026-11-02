import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { hasAnyRole, hasAllRoles } from "@/features/auth/utils/roleHelpers";
import type { Role } from "@/shared/types/common.types";

const AuthenticatedConnections = lazy(
  () => import("@/components/guards/AuthenticatedConnections"),
);

interface RoleRouteProps {
  roles: readonly Role[];
  requireAll?: boolean;
}

/**
 * Guard for routes that require specific roles.
 * Supports both "any of" (default) and "all of" role checks.
 * Redirects to /library if the user's roles do not satisfy the requirement.
 *
 * It also mounts the app-wide SignalR connections so every authenticated role
 * area shares the same notification/chat connections for the session.
 */
const RoleRoute = ({ roles, requireAll = false }: RoleRouteProps) => {
  const auth = useAppSelector((state) => state.auth);
  if (!auth.isAuthenticated || !auth.user || auth.user.roles.length == 0)
    return <Navigate to="/login" replace />;
  if (auth.forceChangePassword)
    return <Navigate to="/change-password" replace />;

  const hasRequiredRole = requireAll
    ? hasAllRoles(auth.user.roles, roles)
    : hasAnyRole(auth.user.roles, roles);

  return hasRequiredRole ? (
    <>
      <AuthenticatedConnections />
      <Outlet />
    </>
  ) : (
    <Navigate to="/access-denied" replace />
  );
};

export default RoleRoute;
