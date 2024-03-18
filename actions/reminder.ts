"use server";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { ReminderSelectModel } from "@/lib/database/schema";
import reminderSchema, { ReminderSchemaType } from "@/schemas/reminder-schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { IValidatedResponse } from "./types";
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
