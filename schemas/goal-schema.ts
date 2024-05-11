import { z } from "zod";

type GoalSchemaMessageConfig = {
  nameRequired: string;
  nameTooLong: string;
  goalAmountTooSmall: string;
  goalAmountRequired: string;
  currentAmountRequired: string;
  currentAmountTooSmall: string;
};

export const getGoalSchema = (message: GoalSchemaMessageConfig) => {
  const {
    nameRequired,
    nameTooLong,
    goalAmountTooSmall,
    goalAmountRequired,
    currentAmountRequired,
    currentAmountTooSmall,
  } = message;
  return z
    .object({
      name: z.string().min(1, nameRequired).max(50, {
        message: nameTooLong,
      }),
      goalAmount: z.coerce
        .number({
          invalid_type_error: goalAmountTooSmall,
          required_error: goalAmountRequired,
        })
        .min(1, goalAmountTooSmall),
      currentAmount: z.coerce
        .number({
          invalid_type_error: currentAmountRequired,
        })
        .min(0, currentAmountTooSmall)
        .default(0)
        .transform((val) => (isNaN(val) ? 0 : val)),
      progress: z.number().default(0),
    })
    .superRefine((data) => {
      data.progress = Math.floor((data.currentAmount / data.goalAmount) * 100);
      return data;
    });
};

export type GoalSchemaType = z.infer<ReturnType<typeof getGoalSchema>>;
