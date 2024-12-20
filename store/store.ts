import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import scrpReducer from "./srcpSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    scraping: scrpReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
