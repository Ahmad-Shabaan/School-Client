import type { ApiErrorResponse } from "@/shared/types/api.types";
import axios from "axios";
export const handleErrorMessage = (unknownError: unknown): ApiErrorResponse => {
  if (axios.isAxiosError(unknownError)) {
    const error = unknownError.response?.data as ApiErrorResponse;
    error.title = error.error ? error.error.message : error.title;
    return error;
  }
  return {
    type: "",
    detail: "",
    status: 500,
    title: "An unexpected error occurred.",
  };
};

// export const handleErrorMessage = (error: unknown): ApiErrorResponse => {
//   if (axios.isAxiosError(error)) {
//     switch (error.response?.status) {
//       case 400:
//         if (error.response?.data?.errors) {
//           // Validation errors from backend
//           // const errors = error.response.data.errors;
//           return error.response.data.errors.join(" ");
//         } else {
//           return "Bad request. Please check your input.";
//         }
//       case 401:
//         return "Unauthorized. Please check your credentials.";
//       case 403:
//         return "Forbidden. You don't have permission to perform this action.";
//       case 404:
//         return "Resource not found.";
//       case 409:
//         return "Conflict. The resource already exists or there is a conflict with the current state.";
//       case 429:
//         return `Too many requests. Please try again after ${error.response?.data?.retryAfter ?? 5} seconds.`;
//       case 500:
//         return "Server error. Please try again later.";
//     }
//     return error.response?.data?.message ?? error.message;
//   }
//   return "An unexpected error occurred.";
// };
