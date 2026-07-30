import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserApi,
  deleteUserApi,
  updateUserApi,
  updateUserStatusApi,
} from "../services/dashboardService";
import {
  type ApiResponse,
  type CreateUserResponse,
  type GetUsersResponse,
  type UpdateUserParams,
  type UpdateUserStatusParams,
  type UserDto,
  type UserRequestDto,
} from "../types/dashboard.types";
import type { AxiosError } from "axios";
import { USERS_QUERY_KEY } from "../constants/dashboard.constants";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { handleErrorMessage } from "@/lib/utils/handleErrorMessage";

type MutationResult = {
  prevState?: GetUsersResponse;
};
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateUserResponse,
    AxiosError,
    UserRequestDto,
    MutationResult
  >({
    mutationFn: createUserApi,
    async onMutate(newUser) {
      const prevState = queryClient.getQueryData<GetUsersResponse>(
        USERS_QUERY_KEY.all(),
      );
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY.all() });
      queryClient.setQueryData(
        USERS_QUERY_KEY.all(),
        (prevState: GetUsersResponse) => {
          if (!prevState) return prevState;
          const userDto: UserDto = {
            ...newUser,
            userName: newUser.email,
            id: uuidv4().toString(),
            createdAt: new Date().toISOString(),
          };
          return {
            ...prevState,
            data: [...prevState.data, userDto],
          };
        },
      );
      return { prevState };
    },
    onError(error, __, mutationResult) {
      if (mutationResult?.prevState)
        queryClient.setQueryData(
          USERS_QUERY_KEY.all(),
          mutationResult.prevState,
        );
      const errorResponse = handleErrorMessage(error);
      toast.error(errorResponse.title);

      // toast.error(
      //   "Oops! We couldn’t add a new member. Please try again in a moment.",
      // );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleCreateUser: (user: UserRequestDto) => mutation.mutate(user),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ApiResponse, AxiosError, string, MutationResult>(
    {
      mutationFn: deleteUserApi,
      async onMutate(userId) {
        const prevState = queryClient.getQueryData<GetUsersResponse>(
          USERS_QUERY_KEY.all(),
        );
        await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY.all() });
        queryClient.setQueryData(
          USERS_QUERY_KEY.all(),
          (prevState: GetUsersResponse) => {
            if (!prevState) return prevState;
            return {
              ...prevState,
              data: prevState.data.filter((user) => user.id !== userId),
            };
          },
        );
        return { prevState };
      },
      onError(_, __, mutationResult) {
        if (mutationResult?.prevState)
          queryClient.setQueryData(
            USERS_QUERY_KEY.all(),
            mutationResult.prevState,
          );

        toast.error(
          "Oops! We couldn’t delete a user. Please try again in a moment.",
        );
      },
      onSuccess: () => {
        toast.success("User has been deleted successfully.");
        queryClient.invalidateQueries({
          queryKey: USERS_QUERY_KEY.all(),
        });
      },
    },
  );

  return {
    handleDeleteUser: (userId: string) => mutation.mutate(userId),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateUserResponse,
    AxiosError,
    UpdateUserParams,
    MutationResult
  >({
    mutationFn: updateUserApi,
    async onMutate(params) {
      const prevState = queryClient.getQueryData<GetUsersResponse>(
        USERS_QUERY_KEY.all(),
      );
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY.all() });
      queryClient.setQueryData(
        USERS_QUERY_KEY.all(),
        (prevState: GetUsersResponse) => {
          if (!prevState) return prevState;
          return {
            ...prevState,
            data: prevState.data.map((user) =>
              user.id === params.userId
                ? {
                    ...user,
                    firstName: params.user.firstName,
                    lastName: params.user.lastName,
                  }
                : user,
            ),
          };
        },
      );
      return { prevState };
    },
    onError(_, __, mutationResult) {
      if (mutationResult?.prevState)
        queryClient.setQueryData(
          USERS_QUERY_KEY.all(),
          mutationResult.prevState,
        );

      toast.error(
        "Oops! We couldn’t delete a user. Please try again in a moment.",
      );
    },
    onSuccess: () => {
      toast.success("User has been updated successfully.");
      queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleUpdateUser: (params: UpdateUserParams) => mutation.mutate(params),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateUserResponse,
    AxiosError,
    UpdateUserStatusParams,
    MutationResult
  >({
    mutationFn: updateUserStatusApi,
    async onMutate(params) {
      const prevState = queryClient.getQueryData<GetUsersResponse>(
        USERS_QUERY_KEY.all(),
      );
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY.all() });
      queryClient.setQueryData(
        USERS_QUERY_KEY.all(),
        (prevState: GetUsersResponse) => {
          if (!prevState) return prevState;
          return {
            ...prevState,
            data: prevState.data.map((user) =>
              user.id === params.userId
                ? {
                    ...user,
                    isActive: params.isActive,
                  }
                : user,
            ),
          };
        },
      );
      return { prevState };
    },
    onError(_, __, mutationResult) {
      if (mutationResult?.prevState)
        queryClient.setQueryData(
          USERS_QUERY_KEY.all(),
          mutationResult.prevState,
        );

      toast.error(
        "Oops! We couldn’t update status of user. Please try again in a moment.",
      );
    },
    onSuccess: () => {
      toast.success("User's status has been updated successfully.");
      queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEY.all(),
      });
    },
  });

  return {
    handleUpdateUserStatus: (params: UpdateUserStatusParams) =>
      mutation.mutate(params),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: handleErrorMessage(mutation.error),
  };
};
