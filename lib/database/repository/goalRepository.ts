import { getPageSizeAndSkipAmount } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import { GoalInsertModel, goals } from "@/lib/database/schema";
import { and, asc, desc, eq, like, sql } from "drizzle-orm";

type GetMultipleGoalsParams = {
  page: number;
  userId: string;
  query?: string;
  sortBy?: string;
  sortDirection?: string;
};

const goalRepository = {
  async create(goalDto: GoalInsertModel) {
    try {
      const [createGoalResponse] = await db.insert(goals).values(goalDto);

      if (createGoalResponse.affectedRows && createGoalResponse.insertId) {
        const goal = await this.getById(createGoalResponse.insertId);

        return {
          affectedRows: createGoalResponse.affectedRows,
          goal,
        };
      }

      return {
        affectedRows: 0,
        goal: null,
      };
    } catch (error) {
      console.error("Error creating goal", error);
      return {
        affectedRows: 0,
        goal: null,
      };
    }
  },
  async deleteById(id: number) {
    try {
      const [deleteGoalResponse] = await db
        .delete(goals)
        .where(eq(goals.id, id));

      return deleteGoalResponse.affectedRows;
    } catch (e) {
      console.error("Error deleting goal", e);
      return 0;
    }
  },
  async getById(id: number) {
    try {
      const [goal] = await db.select().from(goals).where(eq(goals.id, id));

      return goal;
    } catch (error) {
      console.error("Error getting goal by id", error);
      return null;
    }
  },
  async update(goalId: number, goalDto: Partial<GoalInsertModel>) {
    try {
      const [updateResult] = await db
        .update(goals)
        .set(goalDto)
        .where(eq(goals.id, goalId));

      if (!updateResult.affectedRows) {
        return {
          affectedRows: 0,
          updatedGoal: null,
        };
      }

      const updatedGoal = await this.getById(goalId);
      return {
        affectedRows: updateResult.affectedRows,
        updatedGoal,
      };
    } catch (error) {
      console.error("Error updating goal", error);
      return {
        affectedRows: 0,
        updatedGoal: null,
      };
    }
  },
  async getMultiple({
    page,
    userId,
    query,
    sortBy,
    sortDirection,
  }: GetMultipleGoalsParams) {
    const { pageSize, skipAmount } = getPageSizeAndSkipAmount(page);

    let orderByCondition = desc(goals.id);

    const validSortByValues = ["currentAmount", "goalAmount"];

    if (sortBy && sortDirection && validSortByValues.includes(sortBy)) {
      const validSortDirection =
        sortDirection.toLowerCase() === "desc" ? "desc" : "asc";

      switch (sortBy) {
        case "currentAmount":
          orderByCondition =
            validSortDirection === "desc"
              ? desc(goals.currentAmount)
              : asc(goals.currentAmount);
          break;
        case "goalAmount":
          orderByCondition =
            validSortDirection === "desc"
              ? desc(goals.goalAmount)
              : asc(goals.goalAmount);
          break;
        default:
          orderByCondition = desc(goals.id);
          break;
      }
    }

    const budgetsQuery = db
      .select()
      .from(goals)
      .where(and(eq(goals.userId, userId), like(goals.name, `%${query}%`)))
      .orderBy(orderByCondition!)
      .limit(pageSize)
      .offset(skipAmount);

    const budgetsCountQuery = db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(goals)
      .where(and(eq(goals.userId, userId), like(goals.name, `%${query}%`)));

    try {
      const [goals, totalCountResponse] = await Promise.all([
        budgetsQuery,
        budgetsCountQuery,
      ]);

      const totalCount = totalCountResponse[0].count;

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
  },
};

export default goalRepository;
