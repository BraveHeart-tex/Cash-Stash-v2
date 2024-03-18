"use server";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { ReminderSelectModel } from "@/lib/database/schema";
import reminderSchema, { ReminderSchemaType } from "@/schemas/reminder-schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  IGetPaginatedRemindersParams,
  IGetPaginatedRemindersResponse,
  IValidatedResponse,
} from "./types";
import reminderRepository from "@/lib/database/repository/reminderRepository";
import { convertISOToMysqlDatetime } from "@/lib/utils/dateUtils/convertISOToMysqlDatetime";

export const createReminder = async (
  data: ReminderSchemaType
): Promise<IValidatedResponse<ReminderSelectModel>> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const validatedData = reminderSchema.parse(data);

    const createdReminder = await reminderRepository.create({
      ...validatedData,
      reminderDate: convertISOToMysqlDatetime(
        validatedData.reminderDate.toISOString()
      ),
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

export const updateReminder = async (
  reminder: ReminderSchemaType & { id: number }
) => {
  try {
    const validatedData = reminderSchema.parse(reminder);

    const affectedRows = await reminderRepository.update(reminder.id, {
      ...validatedData,
      reminderDate: convertISOToMysqlDatetime(
        validatedData.reminderDate.toISOString()
      ),
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
}: IGetPaginatedRemindersParams): Promise<IGetPaginatedRemindersResponse> => {
  try {
    const { user } = await getUser();

    if (!user) {
      redirect(PAGE_ROUTES.LOGIN_ROUTE);
    }

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
    console.error("Error fetching paginated reminders", error);
    return {
      reminders: [],
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
};
