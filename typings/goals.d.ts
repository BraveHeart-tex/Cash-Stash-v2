import { GoalSelectModel } from "@/lib/database/schema";
import {
  BasePaginatedActionParams,
  BasePaginatedResponse,
  BaseValidatedResponse,
} from "@/typings/baseTypes";

export type CreateGoalReturnType = Promise<
  BaseValidatedResponse<GoalSelectModel>
>;

export type UpdateGoalReturnType = Promise<
  BaseValidatedResponse<GoalSelectModel>
>;

export type GetPaginatedGoalsParams = BasePaginatedActionParams & {
  sortBy?: string;
  sortDirection?: string;
};

export type GetPaginatedGoalsReturnType = Promise<
  BasePaginatedResponse & {
    goals: GoalSelectModel[];
  }
>;
