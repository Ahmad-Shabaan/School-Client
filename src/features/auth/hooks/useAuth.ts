import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import {
  changePasswordApi,
  forgetPasswordApi,
  loginApi,
  logoutApi,
  resetPasswordApi,
} from "../services/authApi";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";
import { persistor } from "@/store/store";
import { RESET_APP } from "@/store/resetAction";
import { USER_QUERY_KEY } from "../constants/auth.constants";
import { setCredentials, clearForceChangePassword } from "../store/authSlice";
import { setRefreshToken, removeRefreshToken } from "../services/tokenService";
import type {
  AuthData,
  changePasswordParams,
  ChangePasswordResponse,
} from "../types/auth.types";
import { ROUTES } from "@/config/routes";
import type { AxiosError } from "axios";

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLoginSuccess = (data: AuthData) => {
    setRefreshToken(data.refreshToken);
    dispatch(
      setCredentials({
        accessToken: data.accessToken,
        user: data.user,
        expiresAt: data.expiresAt,
        forceChangePassword: data.forceChangePassword,
      }),
    );
    queryClient.setQueryData(USER_QUERY_KEY, data);
    if (data.forceChangePassword) {
      navigate("/change-password", { replace: true });
    } else {
      navigate(ROUTES[data.user.roles[0]].basePath, { replace: true });
    }
  };

  // ── Login mutation ────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: handleLoginSuccess,
  });

  // ── Forget password mutation ────────────────────────
  const forgetPasswordMutation = useMutation({
    mutationFn: forgetPasswordApi,
    onSuccess: (response) => {
      const { userId, token } = response.data;
      navigate(`/reset-password?userId=${userId}&token=${token}`, {
        replace: true,
      });
    },
  });

  // ── Reset password mutation ─────────────────────────
  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
  });

  // ── Logout mutation ─────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      dispatch({ type: RESET_APP });
      await queryClient.cancelQueries();
      queryClient.clear();
      removeRefreshToken();
      persistor.pause();
      await persistor.purge();
      navigate("/login", { replace: true });
    },
  });

  const changePasswordMutation = useMutation<
    ChangePasswordResponse,
    AxiosError,
    changePasswordParams
  >({
    mutationFn: changePasswordApi,
    onSuccess: (response) => {
      dispatch(clearForceChangePassword());
      navigate(ROUTES[response.data.roles[0]].basePath, { replace: true });
    },
  });

  return {
    login: (email: string, password: string): void =>
      loginMutation.mutate({ email, password }),
    logout: () => logoutMutation.mutate(),
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: handleErrorMessage(loginMutation.error),
    isLoginError: !!loginMutation.error,
    forgetPassword: (email: string) => forgetPasswordMutation.mutate(email),
    isForgettingPassword: forgetPasswordMutation.isPending,
    forgetPasswordError: handleErrorMessage(forgetPasswordMutation.error),
    isForgettingPasswordError: !!forgetPasswordMutation.error,
    resetPassword: (userId: string, token: string, newPassword: string) =>
      resetPasswordMutation.mutate({ userId, token, newPassword }),
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: handleErrorMessage(resetPasswordMutation.error),
    isResettingPasswordError: !!resetPasswordMutation.error,
    changePassword: (password: string) =>
      changePasswordMutation.mutate({ password }),
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: handleErrorMessage(changePasswordMutation.error),
    isChangingPasswordError: !!changePasswordMutation.error,
  };
}
