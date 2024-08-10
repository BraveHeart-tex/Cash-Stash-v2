import type { ReminderSelectModel } from "@/lib/database/schema";
import type { ReminderSchemaType } from "@/schemas/reminder-schema";
import type {
  BasePaginatedActionParams,
  BasePaginatedResponse,
  BaseValidatedResponse,
} from "@/typings/baseTypes";

export type CreateReminderReturnType =
  BaseValidatedResponse<ReminderSelectModel>;

export type ReminderUpdateModel = ReminderSchemaType & { id: number };

export type GetPaginatedRemindersParams = BasePaginatedActionParams & {
  startDate?: string;
  endDate?: string;
};

export type GetPaginatedRemindersResponse = BasePaginatedResponse & {
  reminders: ReminderSelectModel[];
};

export type UpdateReminderReturnType =
  BaseValidatedResponse<ReminderUpdateModel>;
