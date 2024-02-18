import { z } from "zod";

const CreateGoalSchema = z
  .object({
    name: z.string().min(1).max(50),
    goalAmount: z.coerce.number().min(1),
    currentAmount: z.coerce.number().min(0),
    progress: z.number().default(0),
  })
  .superRefine((data) => {
    data.progress = Math.floor((data.currentAmount / data.goalAmount) * 100);
    return data;
  });

export type CreateGoalSchemaType = z.infer<typeof CreateGoalSchema>;

export default CreateGoalSchema;
