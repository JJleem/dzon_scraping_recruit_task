import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userId: string | null;
  expireAt: string | null;
  iat: string | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,
  expireAt:
    typeof window !== "undefined" ? localStorage.getItem("expireAt") : null,
  iat: typeof window !== "undefined" ? localStorage.getItem("iat") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.expireAt = action.payload.expireAt;
      state.iat = action.payload.iat;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token!);
        localStorage.setItem("userId", action.payload.userId!);
        localStorage.setItem("expireAt", action.payload.expireAt!);
        localStorage.setItem("iat", action.payload.iat!);
      }
    },
    clearAuth: (state) => {
      state.token = null;
      state.userId = null;
      state.expireAt = null;
      state.iat = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expireAt");
        localStorage.removeItem("iat");
      }
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
