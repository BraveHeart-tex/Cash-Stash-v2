import { z } from "zod";

const goalSchema = z
  .object({
    name: z.string().min(1, "Goal name is required").max(50),
    goalAmount: z.coerce.number().min(1, "Goal amount must be greater than 0"),
    currentAmount: z.coerce
      .number()
      .min(0, "Current amount cannot be less than 0"),
    progress: z.number().default(0),
  })
  .superRefine((data) => {
    data.progress = Math.floor((data.currentAmount / data.goalAmount) * 100);
    return data;
  });

export type GoalSchemaType = z.infer<typeof goalSchema>;

export default goalSchema;
