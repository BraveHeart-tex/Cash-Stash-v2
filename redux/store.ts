import { configureStore } from "@reduxjs/toolkit";
import genericConfirmReducer from "./features/genericConfirmSlice";
import genericModalReducer from "./features/genericModalSlice";
import navigationTabsReducer from "./features/navigationTabsSlice";

export const store = configureStore({
  reducer: {
    genericConfirmReducer,
    genericModalReducer,
    navigationTabsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
