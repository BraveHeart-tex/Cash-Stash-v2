import { SelectQuery } from "@/lib/database/queryUtils";
import { Budget, BudgetCategory } from "@/entities/budget";
import { getPageSizeAndSkipAmount } from "@/lib/utils";
import { db } from "@/lib/database/connection";
import { budgets } from "@/lib/database/schema";
import { eq, InferInsertModel } from "drizzle-orm";

type BudgetInsertModel = InferInsertModel<typeof budgets>;

interface IGetMultipleBudgetsParams {
  page: number;
  userId: string;
  query?: string;
  category?: BudgetCategory;
  sortBy?: string;
  sortDirection?: string;
}

const getById = async (id: number) => {
  try {
    const [budget] = await db.select().from(budgets).where(eq(budgets.id, id));

    return budget;
  } catch (error) {
    console.error("Error getting budget by id", error);
    return null;
  }
};

const getMultiple = async ({
  page,
  query,
  userId,
  category,
  sortBy,
  sortDirection,
}: IGetMultipleBudgetsParams) => {
  const { pageSize, skipAmount } = getPageSizeAndSkipAmount(page);
  const validBudgetSortByOptions: {
    [key: string]: boolean;
  } = {
    progress: true,
    spentAmount: true,
    budgetAmount: true,
  };

  let budgetsQuery = `SELECT * FROM Budget where userId = :userId and name like :query`;
  let totalCountQuery = `SELECT COUNT(*) as totalCount FROM Budget where userId = :userId and name like :query`;

  let budgetsQueryParams: {
    userId: string;
    query: string;
    category?: BudgetCategory;
    limit?: number;
    offset?: number;
  } = {
    userId,
    query: `%${query}%`,
  };

  let totalCountQueryParams: {
    userId: string;
    query: string;
    category?: BudgetCategory;
  } = {
    userId,
    query: `%${query}%`,
  };

  if (category) {
    budgetsQuery += ` and category = :category`;
    totalCountQuery += ` and category = :category`;
    budgetsQueryParams.category = category;
    totalCountQueryParams.category = category;
  }

  if (sortBy && sortDirection) {
    const validSortDirection =
      sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const validSortBy = validBudgetSortByOptions[sortBy] ? sortBy : "id";

    budgetsQuery += ` ORDER BY ${validSortBy} ${validSortDirection}`;
  }

  budgetsQuery += ` LIMIT :limit OFFSET :offset`;
  budgetsQueryParams.limit = pageSize;
  budgetsQueryParams.offset = skipAmount;

  try {
    const [budgets, totalCountResult] = await Promise.all([
      SelectQuery<Budget>(budgetsQuery, budgetsQueryParams),
      SelectQuery<{ totalCount: number }>(
        totalCountQuery,
        totalCountQueryParams
      ),
    ]);

    const totalCount = totalCountResult[0].totalCount;

    return {
      budgets,
      totalCount,
    };
  } catch (error) {
    console.error("Error getting budgets", error);

    return {
      budgets: [],
      totalCount: 0,
    };
  }
};

const create = async (budgetDto: BudgetInsertModel) => {
  try {
    const [insertResult] = await db.insert(budgets).values(budgetDto);

    return insertResult.affectedRows;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

const update = async (
  budgetId: number,
  budgetDto: Partial<BudgetInsertModel>
) => {
  try {
    const [budgetBugetResponse] = await db
      .update(budgets)
      .set(budgetDto)
      .where(eq(budgets.id, budgetId));

    const updatedBudget = await getById(budgetId);

    return {
      affectedRows: budgetBugetResponse.affectedRows,
      updatedBudget,
    };
  } catch (error) {
    console.error("Error updating budget", error);
    return {
      affectedRows: 0,
      updatedBudget: null,
    };
  }
};

const deleteById = async (id: number) => {
  try {
    const [deleteBudgetResponse] = await db
      .delete(budgets)
      .where(eq(budgets.id, id));

    return deleteBudgetResponse.affectedRows;
  } catch (error) {
    console.error("Error deleting budget", error);
    return 0;
  }
};

const budgetRepository = {
  getById,
  create,
  update,
  deleteById,
  getMultiple,
};

export default budgetRepository;
