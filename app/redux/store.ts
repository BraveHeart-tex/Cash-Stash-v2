import { configureStore } from '@reduxjs/toolkit';
import userAccountReducer from './features/userAccountSlice';
import currentAccountReducer from './features/currentAccountSlice';
import userReducer from './features/userSlice';
import budgetReducer from './features/budgetSlice';
import currentBudgetReducer from './features/currentBudgetSlice';
import currentGoalReducer from './features/currentGoalSlice';
import goalReducer from './features/goalSlice';
import transactionsReducer from './features/transactionsSlice';
import remindersReducer from './features/remindersSlice';

export const store = configureStore({
  reducer: {
    userAccountReducer,
    userReducer,
    currentAccountReducer,
    budgetReducer,
    currentBudgetReducer,
    goalReducer,
    currentGoalReducer,
    transactionsReducer,
    remindersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
