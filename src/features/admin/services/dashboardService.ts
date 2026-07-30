import axiosClient from "@/shared/api/axiosClient";
import type {
  ApiResponse,
  CreateUserResponse,
  GetUsersResponse,
  UpdateUserParams,
  UpdateUserStatusParams,
  UserRequestDto,
  UserResponseDto,
  UsersFilters,
} from "../types/dashboard.types";

export const getUsers = async (
  filters: UsersFilters,
): Promise<GetUsersResponse> => {
  const response = await axiosClient.get<GetUsersResponse>(
    `/users?page=${filters.pageIndex}&pageSize=${filters.pageSize}&searchTerm=${filters.search}`,
  );
  return response.data;
};

export const getUser = async (userId: string): Promise<UserResponseDto> => {
  const response = await axiosClient.get<UserResponseDto>(`/users/${userId}`);
  return response.data;
};

export const createUserApi = async (
  user: UserRequestDto,
): Promise<CreateUserResponse> => {
  const response = await axiosClient.post<CreateUserResponse>("/users", user);
  return response.data;
};

export const updateUserApi = async ({
  user,
  userId,
}: UpdateUserParams): Promise<CreateUserResponse> => {
  const response = await axiosClient.put<CreateUserResponse>(
    `/users/${userId}`,
    user,
  );
  return response.data;
};

export const updateUserStatusApi = async ({
  isActive,
  userId,
}: UpdateUserStatusParams): Promise<CreateUserResponse> => {
  const response = await axiosClient.put<CreateUserResponse>(
    `/users/${userId}/status`,
    { isActive, id: userId },
  );
  return response.data;
};

export const deleteUserApi = async (userId: string): Promise<ApiResponse> => {
  const response = await axiosClient.delete<ApiResponse>(`/users/${userId}`);
  return response.data;
};
