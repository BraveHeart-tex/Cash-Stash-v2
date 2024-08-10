"use server";
import { authenticatedAction } from "@/lib/auth/authUtils";
import reminderRepository from "@/lib/database/repository/reminderRepository";
import { convertISOToMysqlDateTime } from "@/lib/utils/dateUtils/convertISOToMysqlDateTime";
import logger from "@/lib/utils/logger";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import reminderSchema, {
  type ReminderSchemaType,
} from "@/schemas/reminder-schema";
import type {
  CreateReminderReturnType,
  GetPaginatedRemindersParams,
  GetPaginatedRemindersResponse,
  ReminderUpdateModel,
  UpdateReminderReturnType,
} from "@/typings/reminders";
import { ZodError } from "zod";

export const createReminder = authenticatedAction<
  CreateReminderReturnType,
  ReminderSchemaType
>(async (data, { user }) => {
  try {
    const validatedData = reminderSchema.parse(data);

    const createdReminder = await reminderRepository.create({
      ...validatedData,
      reminderDate: validatedData.reminderDate
        ? convertISOToMysqlDateTime(validatedData.reminderDate.toISOString())
        : null,
      userId: user.id,
    });

    if (!createdReminder) {
      return {
        error: "An error occurred while creating the reminder.",
        fieldErrors: [],
      };
    }

    return {
      data: createdReminder,
      fieldErrors: [],
      error: "",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error: "An error occurred while creating the reminder.",
      fieldErrors: [],
    };
  }
});

export const updateReminder = authenticatedAction<
  UpdateReminderReturnType,
  ReminderUpdateModel
>(async (reminder: ReminderUpdateModel) => {
  try {
    const validatedData = reminderSchema.parse(reminder);

    const affectedRows = await reminderRepository.update(reminder.id, {
      ...validatedData,
      reminderDate: validatedData.reminderDate
        ? convertISOToMysqlDateTime(validatedData.reminderDate.toISOString())
        : null,
    });

    if (!affectedRows) {
      return {
        error: "An error occurred while updating the reminder.",
        fieldErrors: [],
      };
    }

    return {
      data: reminder,
      fieldErrors: [],
      error: "",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error: "An error occurred while updating the reminder.",
      fieldErrors: [],
    };
  }
});

export const getPaginatedReminders = authenticatedAction<
  GetPaginatedRemindersResponse,
  GetPaginatedRemindersParams
>(async ({ query = "", pageNumber = 1, startDate, endDate }, { user }) => {
  try {
    const PAGE_SIZE = 12;
    const skipAmount = (pageNumber - 1) * PAGE_SIZE;

    const { reminders, totalCount } = await reminderRepository.getMultiple({
      query,
      userId: user.id,
      page: pageNumber,
      startDate,
      endDate,
    });

    return {
      reminders,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      hasNextPage: totalCount > skipAmount + PAGE_SIZE,
      hasPreviousPage: pageNumber > 1,
    };
  } catch (error) {
    logger.error("Error fetching paginated reminders", error);
    return {
      reminders: [],
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
});
