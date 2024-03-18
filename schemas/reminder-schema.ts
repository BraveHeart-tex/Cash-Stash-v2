import { z } from "zod";

const reminderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(190, "Title cannot be longer than 190 characters"),
  description: z
    .string()
    .max(512, "Description cannot be longer than 512 characters")
    .default(""),
  reminderDate: z.coerce.date(),
});

export type ReminderSchemaType = z.infer<typeof reminderSchema>;

export default reminderSchema;
