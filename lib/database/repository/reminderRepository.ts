import { getPageSizeAndSkipAmount } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import { type ReminderInsertModel, reminders } from "@/lib/database/schema";
import logger from "@/lib/utils/logger";
import { and, between, eq, like, sql } from "drizzle-orm";

type GetMultipleRemindersParams = {
  userId: string;
  query?: string;
  page: number;
  startDate?: string;
  endDate?: string;
};

const reminderRepository = {
  async create(data: ReminderInsertModel) {
    try {
      const [insertResult] = await db.insert(reminders).values(data);

      if (!insertResult.insertId) {
        return null;
      }

      const [reminder] = await db
        .select()
        .from(reminders)
        .where(eq(reminders.id, insertResult.insertId));

      return reminder;
    } catch (error) {
      logger.error("Create reminder error", error);
      return null;
    }
  },
  async update(reminderId: number, data: Partial<ReminderInsertModel>) {
    try {
      const [updateResult] = await db
        .update(reminders)
        .set(data)
        .where(eq(reminders.id, reminderId));

      return updateResult.affectedRows;
    } catch (error) {
      logger.error("Update reminder error", error);
      return 0;
    }
  },
  async delete(reminderId: number) {
    try {
      const [deleteResult] = await db
        .delete(reminders)
        .where(eq(reminders.id, reminderId));

      return deleteResult.affectedRows;
    } catch (error) {
      logger.error("Delete reminder error", error);
      return 0;
    }
  },
  async getMultiple({
    userId,
    query,
    page,
    startDate,
    endDate,
  }: GetMultipleRemindersParams) {
    const { pageSize, skipAmount } = getPageSizeAndSkipAmount(page);

    let dateFilterCondition = undefined;
    if (startDate && !endDate) {
      dateFilterCondition = eq(reminders.reminderDate, startDate);
    }

    if (startDate && endDate) {
      dateFilterCondition = between(reminders.reminderDate, startDate, endDate);
    }

    const remindersQuery = db
      .select()
      .from(reminders)
      .where(
        and(
          eq(reminders.userId, userId),
          like(reminders.title, `%${query}%`),
          dateFilterCondition,
        ),
      )
      .limit(pageSize)
      .offset(skipAmount);

    const remindersCountQuery = db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(reminders)
      .where(
        and(eq(reminders.userId, userId), like(reminders.title, `%${query}%`)),
      );

    try {
      const [reminders, [totalCount]] = await Promise.all([
        remindersQuery,
        remindersCountQuery,
      ]);

      return {
        reminders,
        totalCount: totalCount.count,
      };
    } catch (error) {
      logger.error("Error fetching paginated reminders", error);
      return {
        reminders: [],
        totalCount: 0,
      };
    }
  },
};

export default reminderRepository;
