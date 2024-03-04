import {
  ModifyQuery,
  ModifyQueryWithSelect,
  SelectQuery,
} from "@/lib/database/queryUtils";
import { GoalDto } from "@/lib/database/dto/goalDto";
import { Goal } from "@/entities/goal";
import { getPageSizeAndSkipAmount } from "@/lib/utils";

const create = async (goalDto: GoalDto) => {
  try {
    const createGoalResponse = await ModifyQuery(
      "INSERT INTO GOAL SET :goalDto",
      { goalDto }
    );

    return createGoalResponse.affectedRows;
  } catch (error) {
    console.error("Error creating goal", error);
    return 0;
  }
};

const getById = async (id: string) => {
  try {
    const goal = await SelectQuery<Goal>("SELECT * FROM GOAL where id = :id", {
      id,
    });

    return goal[0];
  } catch (error) {
    console.error("Error getting goal by id", error);
    return null;
  }
};

interface IGetMultipleGoalsParams {
  page: number;
  userId: string;
  query?: string;
  sortBy?: string;
  sortDirection?: string;
}

const getMultiple = async ({
  page,
  userId,
  query,
  sortBy,
  sortDirection,
}: IGetMultipleGoalsParams) => {
  const { pageSize, skipAmount } = getPageSizeAndSkipAmount(page);

  let goalsQuery =
    "SELECT * FROM GOAL WHERE userId = :userId and name like :query";
  let totalCountQuery =
    "SELECT COUNT(*) as totalCount FROM GOAL WHERE userId = :userId and name like :query";

  let goalsQueryParam: {
    userId: string;
    query: string;
    limit?: number;
    offset?: number;
  } = {
    userId,
    query: `%${query}%`,
  };
  let totalCountQueryParams: {
    userId: string;
    query: string;
  } = {
    userId,
    query: `%${query}%`,
  };

  const validSortByValues = ["currentAmount", "goalAmount"];

  if (sortBy && sortDirection && validSortByValues.includes(sortBy)) {
    const validSortDirection =
      sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    goalsQuery += ` ORDER BY ${sortBy} ${validSortDirection}`;
  }

  goalsQuery += " LIMIT :limit OFFSET :offset";
  goalsQueryParam.limit = pageSize;
  goalsQueryParam.offset = skipAmount;

  try {
    const [goals, totalCountResponse] = await Promise.all([
      SelectQuery<Goal>(goalsQuery, goalsQueryParam),
      SelectQuery<{ totalCount: number }>(
        totalCountQuery,
        totalCountQueryParams
      ),
    ]);

    const totalCount = totalCountResponse[0].totalCount;

    return {
      goals,
      totalCount,
    };
  } catch (error) {
    return {
      goals: [],
      totalCount: 0,
    };
  }
};

const deleteById = async (id: string) => {
  try {
    const deletedGoal = await ModifyQuery("DELETE FROM GOAL WHERE id = :id", {
      id,
    });

    return deletedGoal.affectedRows;
  } catch (e) {
    console.error("Error deleting goal", e);
    return 0;
  }
};

const update = async (goalDto: Partial<GoalDto>) => {
  try {
    const updateResult = await ModifyQueryWithSelect<Goal>(
      "UPDATE GOAL set name = :name, goalAmount = :goalAmount, currentAmount = :currentAmount, progress = :progress, updatedAt = :updatedAt WHERE id = :id; SELECT * from GOAL where id = :id;",
      goalDto
    );

    return {
      affectedRows: updateResult.affectedRows,
      updatedGoal: updateResult.updatedRow,
    };
  } catch (error) {
    console.error("Error updating goal", error);
    return {
      affectedRows: 0,
      updatedGoal: null,
    };
  }
};

const goalRepository = {
  create,
  deleteById,
  getById,
  update,
  getMultiple,
};

export default goalRepository;
