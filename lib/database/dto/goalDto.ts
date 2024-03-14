import { GoalSchemaType } from "@/schemas/goal-schema";
import { GoalInsertModel } from "@/lib/database/schema";

export const createGoalDto = (
  data: GoalSchemaType,
  userId: string
): GoalInsertModel => {
  return {
    ...data,
    userId,
    updatedAt: new Date().toISOString(),
  };
};
