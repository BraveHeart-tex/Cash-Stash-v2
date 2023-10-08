import { z } from "zod";

const CreateGoalSchema = z.object({
  name: z.string().min(1).max(50),
  goalAmount: z.coerce.number().min(1),
  currentAmount: z.coerce.number().min(0),
});

export type CreateGoalSchemaType = z.infer<typeof CreateGoalSchema>;

export default CreateGoalSchema;
