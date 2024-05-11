import { BudgetSelectModel } from "@/lib/database/schema";
import {
  BasePaginatedActionParams,
  BasePaginatedResponse,
  BaseValidatedResponse,
} from "@/typings/baseTypes";

export type CreateBudgetReturnType = BaseValidatedResponse<BudgetSelectModel>;

export type UpdateBudgetReturnType = BaseValidatedResponse<BudgetSelectModel>;

export type GetPaginatedBudgetsParams = BasePaginatedActionParams & {
  category?: number;
  sortBy?: string;
  sortDirection?: string;
};

export type GetPaginatedBudgetsReturnType = BasePaginatedResponse & {
  budgets: BudgetWithCategory[];
};

export type BudgetWithCategory = BudgetSelectModel & { category: string };

export type DeleteBudgetReturnType =
  | {
      error: string;
      data?: undefined;
    }
  | {
      data: string;
      error?: undefined;
    };
