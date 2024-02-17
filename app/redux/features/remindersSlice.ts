import { getGeneric, getGenericListByCurrentUser } from "@/actions/generic";
import { Reminder } from "@prisma/client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export type SerializedReminder = Omit<
  Reminder,
  "createdAt" | "updatedAt" | "reminderDate"
> & {
  createdAt: string;
  updatedAt: string;
  reminderDate: string;
};

interface RemindersState {
  reminders: SerializedReminder[] | null;
  currentReminder: SerializedReminder | null;
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

    const serializedReminders = result.data.map((reminder) => ({
      ...reminder,
      createdAt: new Date(reminder.createdAt).toLocaleDateString(),
      updatedAt: new Date(reminder.updatedAt).toLocaleDateString(),
      reminderDate: new Date(reminder.reminderDate).toLocaleDateString(),
    }));

    return serializedReminders;
  }
);

export const fetchReminderById = createAsyncThunk(
  "reminders/fetchReminderById",
  async (reminderId: string) => {
    const result = await getGeneric<Reminder>({
      tableName: "reminder",
      whereCondition: { id: reminderId },
    });

    if (result?.error || !result?.data) return null;

    const serializedReminder = {
      ...result.data,
      createdAt: new Date(result.data.createdAt).toLocaleDateString(),
      updatedAt: new Date(result.data.updatedAt).toLocaleDateString(),
      reminderDate: new Date(result.data.reminderDate).toLocaleDateString(),
    };

    return serializedReminder;
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
