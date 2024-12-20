import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import apiHistoryReducer from "./apiHistorySlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    apiHistory: apiHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
