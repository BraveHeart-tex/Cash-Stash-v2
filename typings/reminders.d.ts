import { ReminderSelectModel } from "@/lib/database/schema";
import { ReminderSchemaType } from "@/schemas/reminder-schema";
import {
  BasePaginatedActionParams,
  BasePaginatedResponse,
  BaseValidatedResponse,
} from "@/typings/baseTypes";

export type CreateReminderReturnType = Promise<
  BaseValidatedResponse<ReminderSelectModel>
>;

export type ReminderUpdateModel = ReminderSchemaType & { id: number };

export type GetPaginatedRemindersParams = BasePaginatedActionParams & {
  startDate?: string;
  endDate?: string;
};

export type GetPaginatedRemindersResponse = Promise<
  BasePaginatedResponse & {
    reminders: ReminderSelectModel[];
  }
>;
