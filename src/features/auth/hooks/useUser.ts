import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { meQueryOptions } from "../options/auth.options";
import { setCredentials } from "../store/authSlice";

export default function useUser(skipAuthRefresh?: boolean) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data, isLoading, error } = useQuery(meQueryOptions(skipAuthRefresh));

  useEffect(() => {
    if (data?.accessToken && data.refreshToken && data.expiresAt) {
      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          user: data.user,
          expiresAt: data.expiresAt,
          forceChangePassword: data.forceChangePassword,
        }),
      );
    }
  }, [data, dispatch]);

  return {
    user: authUser,
    isLoading,
    isAuthenticated: isAuthenticated || !!authUser,
    error,
  };
}
