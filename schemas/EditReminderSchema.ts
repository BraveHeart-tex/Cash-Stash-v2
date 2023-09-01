import { z } from "zod";

const EditReminderSchema = z.object({
  title: z.coerce
    .string()
    .min(3, "Title is required")
    .max(20, "Title cannot be longer than 20 characters"),
  description: z.coerce
    .string()
    .min(3, "Description is required")
    .max(50, "Description cannot be longer than 50 characters"),
  amount: z.coerce
    .number()
    .min(1, "Amount is required")
    .max(1000000, "Amount cannot be more than 1 million"),
  reminderDate: z.string().nonempty("Reminder date is required"),
  isIncome: z.union([z.literal("income"), z.literal("expense")]),
  isRead: z.union([z.literal("isRead"), z.literal("isNotRead")]),
});

export type EditReminderSchemaType = z.infer<typeof EditReminderSchema>;

export default EditReminderSchema;
