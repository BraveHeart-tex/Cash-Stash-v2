import { configureStore } from "@reduxjs/toolkit";
import genericModalReducer from "./features/genericModalSlice";

export const store = configureStore({
  reducer: {
    genericModalReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
