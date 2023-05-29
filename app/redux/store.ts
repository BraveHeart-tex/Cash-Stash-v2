import { configureStore } from '@reduxjs/toolkit';
import userAccountReducer from './features/userAccountSlice';
import currentAccountReducer from './features/currentAccountSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    userAccountReducer,
    userReducer,
    currentAccountReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
