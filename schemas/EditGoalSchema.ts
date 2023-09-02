import { z } from "zod";
import CreateGoalSchema from "./CreateGoalSchema";

const EditGoalSchema = CreateGoalSchema;

export type EditGoalSchemaType = z.infer<typeof EditGoalSchema>;

export default EditGoalSchema;
