// # Configured axios instance
import axios from "axios";
import { config } from "@/config/env";
import { store } from "@/store/store";
import {
  getRefreshToken,
  setRefreshToken,
} from "@/features/auth/services/tokenService";
import { setCredentials } from "@/features/auth/store/authSlice";
import type { RefreshTokenResponse } from "../types/api.types";
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const axiosClient = axios.create({
  baseURL: config.apiUrl,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//  Handle 401 globally — auto logout
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const retryRequest = () => axiosClient(original);

    // Try refresh once on 401
    const shouldRefresh: boolean =
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/login") &&
      !original.skipAuthRefresh &&
      !original.url?.includes("/refresh-token");
    if (shouldRefresh) {
      original._retry = true;
      // 🔒 If refresh already running → wait
      if (isRefreshing && refreshPromise) {
        // coming requests will wait until refreshPromise resolves, then retry original request
        // req b and c waits until req a finishes then they will retry with the new token
        // store callback fun in microtask queue for req b,c to retry after refresh completes
        return refreshPromise.then(retryRequest).catch(() => {
          return Promise.reject(error);
        });
      }

      isRefreshing = true;
      const refreshToken = getRefreshToken();
      refreshPromise = axios
        .post(
          `${config.apiUrl}/auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        )
        .then((res) => {
          const data: RefreshTokenResponse = res.data;
          isRefreshing = false;
          refreshPromise = null;
          setRefreshToken(data.data.refreshToken);
          store.dispatch(
            setCredentials({
              accessToken: data.data.accessToken,
              expiresAt: data.data.accessTokenExpiration,
            }),
          );
        })
        .catch(() => {
          isRefreshing = false;
          refreshPromise = null;
          return Promise.reject(error);
        });
      return refreshPromise
        .then(retryRequest)
        .catch(() => Promise.reject(error));
    }
    if (!error.response) {
      error.message = "Server is unreachable. Please try again later.";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
