import { queryOptions } from "@tanstack/react-query";
import {
  EMAILS_GC_TIME,
  EMAILS_QUERY_KEY,
  EMAILS_STALE_TIME,
  USERS_GC_TIME,
  USERS_QUERY_KEY,
  USERS_STALE_TIME,
} from "../constants/dashboard.constants";
import type {
  GetUsersEmailResponse,
  GetUsersResponse,
  UserResponseDto,
  UsersFilters,
} from "../types/dashboard.types";
import { getUser, getUsers, getUsersEmail } from "../services/dashboardService";
import type { ApiErrorResponse } from "@/shared/types/api.types";

export const usersQueryOptions = (filters: UsersFilters) =>
  queryOptions<GetUsersResponse, ApiErrorResponse>({
    queryKey: USERS_QUERY_KEY.list(filters),
    queryFn: () => getUsers(filters),
    staleTime: USERS_STALE_TIME,
    gcTime: USERS_GC_TIME,
  });

export const userQueryOptions = (id: string) =>
  queryOptions<UserResponseDto, ApiErrorResponse>({
    queryKey: USERS_QUERY_KEY.details(id),
    queryFn: () => getUser(id),
    staleTime: USERS_STALE_TIME,
    gcTime: USERS_GC_TIME,
  });

  export const getUsersEmailQueryOptions = (courseId: number) =>
  queryOptions<GetUsersEmailResponse, ApiErrorResponse>({
    queryKey: EMAILS_QUERY_KEY.list(courseId),
    queryFn: () => getUsersEmail(courseId),
    staleTime: EMAILS_STALE_TIME,
    gcTime: EMAILS_GC_TIME,
  });