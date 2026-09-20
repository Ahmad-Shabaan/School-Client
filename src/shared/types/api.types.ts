export interface ApiResponse {
  success: boolean;
  message: string;
  pagination?: Pagination;
}

export interface Pagination {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
export interface RefreshTokenResponse extends ApiResponse{
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
