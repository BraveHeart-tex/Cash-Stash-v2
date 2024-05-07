import { BudgetSelectModel } from "@/lib/database/schema";
import {
  BasePaginatedActionParams,
  BasePaginatedResponse,
  BaseValidatedResponse,
} from "@/typings/baseTypes";

export type CreateBudgetReturnType = Promise<
  BaseValidatedResponse<BudgetSelectModel>
>;

export type UpdateBudgetReturnType = Promise<
  BaseValidatedResponse<BudgetSelectModel>
>;

export type GetPaginatedBudgetsParams = BasePaginatedActionParams & {
  category?: number;
  sortBy?: string;
  sortDirection?: string;
};

export type GetPaginatedBudgetsReturnType = Promise<
  BasePaginatedResponse & {
    budgets: BudgetWithCategory[];
  }
>;

export type BudgetWithCategory = BudgetSelectModel & { category: string };
