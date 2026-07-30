import type { ApiErrorResponse } from "@/shared/types/api.types";
import type { Role } from "@/shared/types/common.types";

export interface ApiResponse {
  success: boolean;
  message: string;
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface AuthData extends AuthTokens {
  success: boolean;
  message: string;
  forceChangePassword: boolean;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface ChangePasswordResponse extends ApiResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface ForgetPasswordResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    token: string;
  };
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  forceChangePassword: boolean;
}

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: ApiErrorResponse;
  isLoginError?: boolean;
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RefreshResponse = AuthData;

export type changePasswordParams = {
  password: string;
};
