import { queryOptions } from "@tanstack/react-query";
import {
  USERS_GC_TIME,
  USERS_QUERY_KEY,
  USERS_STALE_TIME,
} from "../constants/dashboard.constants";
import type {
  GetUsersResponse,
  UserResponseDto,
  UsersFilters,
} from "../types/dashboard.types";
import { getUser, getUsers } from "../services/dashboardService";
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
