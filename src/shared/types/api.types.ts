export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    refreshToken: string;
    accessToken: string;
    accessTokenExpiration: string;
  };
}
export interface ApiError {
  code: string;
  statusCode: number;
  message: string;
}
export interface ApiErrorResponse {
  type: string;
  title: string;
  detail: string;
  status: number;
  error?: ApiError;
  errors?: Record<string, string[]>;
}
