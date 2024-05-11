import { GoalSelectModel } from "@/lib/database/schema";
import {
  BasePaginatedActionParams,
  BasePaginatedResponse,
  BaseValidatedResponse,
} from "@/typings/baseTypes";

export type CreateGoalReturnType = BaseValidatedResponse<GoalSelectModel>;

export type UpdateGoalReturnType = BaseValidatedResponse<GoalSelectModel>;

export type GetPaginatedGoalsParams = BasePaginatedActionParams & {
  sortBy?: string;
  sortDirection?: string;
};

export type GetPaginatedGoalsReturnType = BasePaginatedResponse & {
  goals: GoalSelectModel[];
};

export type DeleteGoalReturnType =
  | {
      error: string;
      data?: undefined;
    }
  | {
      data: string;
      error?: undefined;
    };
