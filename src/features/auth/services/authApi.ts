import axiosClient from "@/shared/api/axiosClient";
import type {
  AuthResponse,
  AuthData,
  LoginCredentials,
  RefreshResponse,
  ForgetPasswordResponse,
  ChangePasswordResponse,
  changePasswordParams,
} from "../types/auth.types";
import type { SignupFormValues } from "@/lib/utils/validation";

const unwrapData = (response: { data: AuthResponse }): AuthData => {
  const payload = response.data?.data;
  if (!payload) {
    throw new Error("Invalid authentication response");
  }
  return payload;
};

const loginApi = async (creds: LoginCredentials): Promise<AuthData> => {
  const response = await axiosClient.post<AuthResponse>("/auth/login", creds);
  return unwrapData(response);
};

const getMe = async (skipAuthRefresh?: boolean): Promise<AuthData> => {
  console.log("start");
  const response = await axiosClient.get<AuthResponse>("/users/me", {
    skipAuthRefresh: skipAuthRefresh ?? false,
  });
  return unwrapData(response);
};

const logoutApi = async (): Promise<void> => {
  await axiosClient.delete("/auth/logout");
};

const refreshApi = async (): Promise<RefreshResponse> => {
  const response = await axiosClient.post<AuthResponse>("/auth/refresh-token");
  return unwrapData(response);
};

const signupApi = async (creds: SignupFormValues): Promise<AuthData> => {
  const response = await axiosClient.post<AuthResponse>(
    "/auth/register",
    creds,
  );
  return unwrapData(response);
};

const forgetPasswordApi = async (
  email: string,
): Promise<ForgetPasswordResponse> => {
  const response = await axiosClient.post<ForgetPasswordResponse>(
    `/auth/forget-password?email=${encodeURIComponent(email)}`,
  );
  return response.data;
};

const resetPasswordApi = async (data: {
  userId: string;
  token: string;
  newPassword: string;
}): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(
    "/auth/reset-password",
    data,
  );
  return response.data;
};

const changePasswordApi = async (
  data: changePasswordParams,
): Promise<ChangePasswordResponse> => {
  const response = await axiosClient.post<ChangePasswordResponse>(
    "/auth/change-password",
    data,
  );
  return response.data;
};

export {
  loginApi,
  logoutApi,
  refreshApi,
  signupApi,
  forgetPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  getMe,
};
