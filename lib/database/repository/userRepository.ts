import { db } from "@/lib/database/connection";
import { UserInsertModel, users } from "@/lib/database/schema";
import { and, eq, InferSelectModel } from "drizzle-orm";
import logger from "@/lib/utils/logger";

export type UserSelectModel = InferSelectModel<typeof users>;

const userRepository = {
  async getByEmail(email: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.emailVerified, 1)));

      return user;
    } catch (e) {
      logger.error(e);
      return null;
    }
  },
  async getById(id: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .execute();

      return user;
    } catch (e) {
      logger.error(e);
      return null;
    }
  },
  async createUser(data: UserInsertModel, withReturning?: boolean) {
    try {
      const [insertResult] = await db.insert(users).values(data);

      const affectedRows = insertResult.affectedRows;

      if (withReturning && affectedRows) {
        const user = await this.getUnverifiedUserByEmail(data.email);
        return {
          affectedRows,
          user,
        };
      }

      return {
        affectedRows,
        user: null,
      };
    } catch (error) {
      logger.error(error);
      return {
        affectedRows: 0,
        user: null,
      };
    }
  },
  async getUnverifiedUserByEmail(email: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.emailVerified, 0)));

      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  },
  async getVerifiedUserByEmail(email: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.emailVerified, 1)));

      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  },
  async updateUser(userId: string, data: Partial<UserInsertModel>) {
    return await db.update(users).set(data).where(eq(users.id, userId));
  },
};

export default userRepository;
