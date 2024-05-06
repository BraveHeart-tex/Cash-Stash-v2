"use server";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import reminderSchema, { ReminderSchemaType } from "@/schemas/reminder-schema";
import { redirect } from "@/navigation";
import { ZodError } from "zod";
import reminderRepository from "@/lib/database/repository/reminderRepository";
import { convertISOToMysqlDatetime } from "@/lib/utils/dateUtils/convertISOToMysqlDatetime";
import logger from "@/lib/utils/logger";
import {
  CreateReminderReturnType,
  GetPaginatedRemindersParams,
  GetPaginatedRemindersResponse,
  ReminderUpdateModel,
} from "@/typings/reminders";

export const createReminder = async (
  data: ReminderSchemaType
): CreateReminderReturnType => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const validatedData = reminderSchema.parse(data);

    const createdReminder = await reminderRepository.create({
      ...validatedData,
      reminderDate: validatedData.reminderDate
        ? convertISOToMysqlDatetime(validatedData.reminderDate.toISOString())
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
};

export const updateReminder = async (reminder: ReminderUpdateModel) => {
  try {
    const validatedData = reminderSchema.parse(reminder);

    const affectedRows = await reminderRepository.update(reminder.id, {
      ...validatedData,
      reminderDate: validatedData.reminderDate
        ? convertISOToMysqlDatetime(validatedData.reminderDate.toISOString())
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
};

export const getPaginatedReminders = async ({
  query = "",
  pageNumber = 1,
  startDate,
  endDate,
}: GetPaginatedRemindersParams): GetPaginatedRemindersResponse => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }
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
};
