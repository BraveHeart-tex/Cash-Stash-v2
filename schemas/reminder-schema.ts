import { reminders } from "@/lib/database/schema";
import { z } from "zod";

const reminderSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(190, "Title cannot be longer than 190 characters"),
    description: z
      .string()
      .max(512, "Description cannot be longer than 512 characters")
      .default(""),
    reminderDate: z.coerce.date().nullable(),
    type: z
      .enum(reminders.type.enumValues, {
        required_error: "Type is required",
        invalid_type_error: "Invalid type",
      })
      .default("ONE_TIME"),
    recurrence: z.enum(reminders.recurrence.enumValues).nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "ONE_TIME" && !data.reminderDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Reminder date is required",
        path: ["reminderDate"],
      });
    }

    if (data.type === "RECURRING" && !data.recurrence) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must select a recurrence type",
        path: ["recurrence"],
      });
    }
  });

export type ReminderSchemaType = z.infer<typeof reminderSchema>;

export default reminderSchema;
