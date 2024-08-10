import { getPageSizeAndSkipAmount } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import {
  type BudgetInsertModel,
  budgets,
  categories,
} from "@/lib/database/schema";
import logger from "@/lib/utils/logger";
import { and, asc, desc, eq, getTableColumns, like, sql } from "drizzle-orm";

type GetMultipleBudgetsParams = {
  page: number;
  userId: string;
  query?: string;
  category?: number;
  sortBy?: string;
  sortDirection?: string;
};

const budgetRepository = {
  async getById(id: number) {
    try {
      const [budget] = await db
        .select()
        .from(budgets)
        .where(eq(budgets.id, id));

      return budget;
    } catch (error) {
      logger.error("Error getting budget by id", error);
      return null;
    }
  },
  async create(budgetDto: BudgetInsertModel) {
    try {
      const [insertResult] = await db.insert(budgets).values(budgetDto);

      if (insertResult.affectedRows && insertResult.insertId) {
        const [budget] = await db
          .select()
          .from(budgets)
          .where(eq(budgets.id, insertResult.insertId));

        return {
          affectedRows: insertResult.affectedRows,
          budget,
        };
      }

      return {
        affectedRows: insertResult.affectedRows,
        budget: null,
      };
    } catch (error) {
      logger.error(error);
      return {
        affectedRows: 0,
        budget: null,
      };
    }
  },
  async update(budgetId: number, budgetDto: Partial<BudgetInsertModel>) {
    try {
      const [updateBudgetResponse] = await db
        .update(budgets)
        .set(budgetDto)
        .where(eq(budgets.id, budgetId));

      const updatedBudget = await this.getById(budgetId);

      return {
        affectedRows: updateBudgetResponse.affectedRows,
        updatedBudget,
      };
    } catch (error) {
      logger.error("Error updating budget", error);
      return {
        affectedRows: 0,
        updatedBudget: null,
      };
    }
  },
  async deleteById(id: number) {
    try {
      const [deleteBudgetResponse] = await db
        .delete(budgets)
        .where(eq(budgets.id, id));

      return deleteBudgetResponse.affectedRows;
    } catch (error) {
      logger.error("Error deleting budget", error);
      return 0;
    }
  },
  async getMultiple({
    page,
    query,
    userId,
    category,
    sortBy,
    sortDirection,
  }: GetMultipleBudgetsParams) {
    const { pageSize, skipAmount } = getPageSizeAndSkipAmount(page);
    const validBudgetSortByOptions: {
      [key: string]: boolean;
    } = {
      progress: true,
      spentAmount: true,
      budgetAmount: true,
    };

    const categoryCondition = category
      ? eq(budgets.categoryId, category)
      : undefined;

    let orderByCondition = desc(budgets.id);

    if (sortBy && sortDirection) {
      const validSortDirection =
        sortDirection.toLowerCase() === "desc" ? "desc" : "asc";

      const validSortBy = validBudgetSortByOptions[sortBy] ? sortBy : "id";

      switch (validSortBy) {
        case "progress":
          orderByCondition =
            validSortDirection === "desc"
              ? desc(budgets.progress)
              : asc(budgets.progress);
          break;
        case "spentAmount":
          orderByCondition =
            validSortDirection === "desc"
              ? desc(budgets.spentAmount)
              : asc(budgets.spentAmount);
          break;
        case "budgetAmount":
          orderByCondition =
            validSortDirection === "desc"
              ? desc(budgets.budgetAmount)
              : asc(budgets.budgetAmount);
          break;
        default:
          orderByCondition = desc(budgets.id);
          break;
      }
    }

    const budgetsQuery = db
      .select({
        ...getTableColumns(budgets),
        category: categories.name,
      })
      .from(budgets)
      .innerJoin(categories, eq(budgets.categoryId, categories.id))
      .where(
        and(
          eq(budgets.userId, userId),
          like(budgets.name, `%${query}%`),
          categoryCondition,
        ),
      )
      .orderBy(orderByCondition)
      .limit(pageSize)
      .offset(skipAmount);

    const budgetCountQuery = db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, userId),
          like(budgets.name, `%${query}%`),
          categoryCondition,
        ),
      );

    try {
      const [budgets, totalCountResult] = await Promise.all([
        budgetsQuery,
        budgetCountQuery,
      ]);

      const totalCount = totalCountResult[0].count;

      return {
        budgets,
        totalCount,
      };
    } catch (error) {
      logger.error("Error getting budgets", error);

      return {
        budgets: [],
        totalCount: 0,
      };
    }
  },
};

export default budgetRepository;
