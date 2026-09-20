import type {
  CreateUserFormValues,
  UpdateUserFormValues,
} from "@/lib/utils/validation";
import type { ApiErrorResponse, ApiResponse } from "@/shared/types/api.types";

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  isActive: boolean;
  createdAt: string;
}
export interface FullUserDto extends UserDto {
  forceChangePassword: boolean;
  lastLogin: string;
  roles: string[];
}
export interface UserRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  forceChangePassword: boolean;
}

export interface UpdateUserRequestDto {
  firstName: string;
  lastName: string;
}

// export interface ApiResponse {
//   success: boolean;
//   message: string;
//   pageNumber: number;
//   pageSize: number;
//   totalCount: number;
//   totalPages: number;
// }

export interface GetUsersResponse extends ApiResponse {
  data: UserDto[];
}

export interface CreateUserResponse extends ApiResponse {
  data: UserDto;
}
export interface UserResponseDto extends ApiResponse {
  data: FullUserDto;
}

export type UpdateUserParams = {
  user: UpdateUserRequestDto;
  userId: string;
};
export type UpdateUserStatusParams = {
  isActive: boolean;
  userId: string;
};

export interface CreateUserFormProps {
  onSubmit: (values: CreateUserFormValues) => Promise<void> | void;
  isLoading?: boolean;
  error?: ApiErrorResponse;
  isError?: boolean;
}

export interface UpdateUserFormProps {
  onSubmit: (values: UpdateUserFormValues) => Promise<void> | void;
  isLoading?: boolean;
  error?: string;
  isError?: boolean;
}

export interface UsersFilters {
  status?: boolean;
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
}
