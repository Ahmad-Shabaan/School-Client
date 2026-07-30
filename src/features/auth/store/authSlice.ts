import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../types/auth.types";

const initialState: AuthState = {
  accessToken: null,
  user: null,
  expiresAt: null,
  isAuthenticated: false,
  forceChangePassword: false,
};

interface SetCredentialsPayload {
  accessToken: string;
  user?: User;
  expiresAt: string;
  forceChangePassword?: boolean;
}

interface UpdateAccessTokenPayload {
  accessToken: string;
  expiresAt: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<SetCredentialsPayload>) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.user) state.user = action.payload.user;
      state.expiresAt = action.payload.expiresAt;
      if (action.payload.forceChangePassword)
        state.forceChangePassword = action.payload.forceChangePassword;
      state.isAuthenticated = true;
    },
    updateAccessToken(state, action: PayloadAction<UpdateAccessTokenPayload>) {
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearForceChangePassword(state) {
      state.forceChangePassword = false;
    },
    clearAuth() {
      return initialState;
    },
  },
});

export const {
  setCredentials,
  updateAccessToken,
  setUser,
  clearForceChangePassword,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
