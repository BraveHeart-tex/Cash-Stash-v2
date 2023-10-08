import { getGeneric, getGenericListByCurrentUser } from "@/actions/generic";
import { Reminder } from "@prisma/client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface RemindersState {
  reminders: Reminder[] | null;
  currentReminder: Reminder | null;
  isLoading: boolean;
}

const initialState: RemindersState = {
  reminders: null,
  currentReminder: null,
  isLoading: false,
};

export const fetchReminders = createAsyncThunk(
  "reminders/fetchReminders",
  async () => {
    const result = await getGenericListByCurrentUser<Reminder>({
      tableName: "reminder",
      whereCondition: { isRead: false },
    });
    if (result?.error || !result?.data || !result?.data?.length) {
      return null;
    }

    return result.data;
  }
);

export const fetchReminderById = createAsyncThunk(
  "reminders/fetchReminderById",
  async (reminderId: number) => {
    const result = await getGeneric<Reminder>({
      tableName: "reminder",
      whereCondition: { id: reminderId },
    });

    if (result?.error) return null;

    return result.data;
  }
);

const remindersSlice = createSlice({
  name: "remindersSlice",
  initialState,
  reducers: {},
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

export default remindersSlice.reducer;
