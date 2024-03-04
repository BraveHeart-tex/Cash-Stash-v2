import { GoalSchemaType } from "@/schemas/goal-schema";
import { createId } from "@paralleldrive/cuid2";

export interface GoalDto {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
  progress: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createGoalDto = (
  data: GoalSchemaType,
  userId: string
): GoalDto => {
  return {
    ...data,
    id: createId(),
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
