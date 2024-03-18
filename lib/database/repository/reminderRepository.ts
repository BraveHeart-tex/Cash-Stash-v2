import { eq } from "drizzle-orm";
import { db } from "../connection";
import { ReminderInsertModel, reminders } from "../schema";

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
      console.error("Create reminder error", error);
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
      console.error("Update reminder error", error);
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
      console.error("Delete reminder error", error);
      return 0;
    }
  },
};

export default reminderRepository;
