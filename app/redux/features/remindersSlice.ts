import {
  getReminderByIdAction,
  getRemindersByCurrentUserAction,
} from "@/actions";
import { Reminder } from "@prisma/client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface RemindersState {
  reminders: Reminder[] | null;
  currentReminder: Reminder | null;
  isLoading: boolean;
  // modals
  isCreateReminderModalOpen: boolean;
  isDeleteReminderModalOpen: boolean;
  isEditReminderModalOpen: boolean;
  selectedReminderId: number;
}

const initialState: RemindersState = {
  reminders: null,
  currentReminder: null,
  isLoading: false,
  // modals
  isCreateReminderModalOpen: false,
  isDeleteReminderModalOpen: false,
  isEditReminderModalOpen: false,
  selectedReminderId: 0,
};

export const fetchReminders = createAsyncThunk(
  "reminders/fetchReminders",
  async () => {
    const result = await getRemindersByCurrentUserAction();
    if (result?.error) return null;

    return result.reminders;
  }
);

export const fetchReminderById = createAsyncThunk(
  "reminders/fetchReminderById",
  async (reminderId: number) => {
    const result = await getReminderByIdAction(reminderId);
    if (result?.error) return null;

    return result.reminder;
  }
);

const remindersSlice = createSlice({
  name: "remindersSlice",
  initialState,
  reducers: {
    setIsCreateReminderModalOpen: (state, action) => {
      state.isCreateReminderModalOpen = action.payload;
    },
    setIsEditReminderModalOpen: (state, action) => {
      state.isEditReminderModalOpen = action.payload.isEditReminderModalOpen;
      state.selectedReminderId = action.payload.selectedReminderId;
    },
    setIsDeleteReminderModalOpen: (state, action) => {
      state.isDeleteReminderModalOpen =
        action.payload.isDeleteReminderModalOpen;
      state.selectedReminderId = action.payload.selectedReminderId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReminders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        if (!action.payload) {
          state.reminders = [];
          return;
        }

        state.reminders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchReminders.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchReminderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReminderById.fulfilled, (state, action) => {
        if (!action.payload) {
          state.currentReminder = null;
          return;
        }
        state.currentReminder = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchReminderById.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setIsCreateReminderModalOpen,
  setIsDeleteReminderModalOpen,
  setIsEditReminderModalOpen,
} = remindersSlice.actions;

export default remindersSlice.reducer;
