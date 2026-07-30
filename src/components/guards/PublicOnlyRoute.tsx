import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { ROUTES } from "@/config/routes";

const PublicOnlyRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userRoles = useAppSelector((state) => state.auth.user?.roles) ?? [];
  if (!isAuthenticated || userRoles.length === 0) return <Outlet />;
  return <Navigate to={ROUTES[userRoles[0]].basePath} replace />;


  
  // if (userRoles.includes(ROLES.Admin))
  //   return <Navigate to="/dashboard" replace />;
  // else if (userRoles.includes(ROLES.PreAdmin))
  //   return <Navigate to="/supervisor" replace />;
  // else if (userRoles.includes(ROLES.Teacher))
  //   return <Navigate to="/teacher" replace />;
  // else if (userRoles.includes(ROLES.Student))
  //   return <Navigate to="/student" replace />;
  // else return <Navigate to="/access-denied" replace />;
};

export default PublicOnlyRoute;
