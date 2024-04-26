import { z } from "zod";

const goalSchema = z
  .object({
    name: z.string().min(1, "Goal name is required").max(50),
    goalAmount: z.coerce
      .number({
        invalid_type_error: "Goal amount must be greater than 0",
        required_error: "Goal amount is required",
      })
      .min(1, "Goal amount must be greater than 0"),
    currentAmount: z.coerce
      .number({
        invalid_type_error: "Current amount must be a number",
      })
      .min(0, "Current amount cannot be less than 0")
      .default(0)
      .transform((val) => (isNaN(val) ? 0 : val)),
    progress: z.number().default(0),
  })
  .superRefine((data) => {
    data.progress = Math.floor((data.currentAmount / data.goalAmount) * 100);
    return data;
  });

export type GoalSchemaType = z.infer<typeof goalSchema>;

export default goalSchema;
