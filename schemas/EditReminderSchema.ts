import { z } from "zod";
import CreateReminderSchema from "./CreateReminderSchema";

const EditReminderSchema = CreateReminderSchema;

export type EditReminderSchemaType = z.infer<typeof EditReminderSchema>;

export default EditReminderSchema;
