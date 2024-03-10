import { db } from "@/lib/database/connection";
import { UserInsertModel, users } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";

const deleteExpiredUsers = () => {};

const getById = async (id: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .execute();

    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const getUnverifiedUserByEmail = async (email: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.emailVerified, 0)));

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getVerifiedUserByEmail = async (email: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.emailVerified, 1)));

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getByEmail = async (email: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.emailVerified, 1)));

    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const createUser = async (data: UserInsertModel, withReturning?: boolean) => {
  try {
    const [insertResult] = await db.insert(users).values(data);

    const affectedRows = insertResult.affectedRows;

    if (withReturning && affectedRows) {
      const user = await getByEmail(data.email);
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
    console.error(error);
    return {
      affectedRows: 0,
      user: null,
    };
  }
};

const updateUser = async (userId: string, data: Partial<UserInsertModel>) => {
  return db.update(users).set(data).where(eq(users.id, userId));
};

const userRepository = {
  deleteExpiredUsers,
  getByEmail,
  getById,
  createUser,
  getUnverifiedUserByEmail,
  getVerifiedUserByEmail,
  updateUser,
};

export default userRepository;
