import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const AuthenticatedConnections = lazy(
  () => import("@/components/guards/AuthenticatedConnections"),
);

const PrivateRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      <AuthenticatedConnections />
      <Outlet />
    </>
  );
};

export default PrivateRoute;
