import { db } from "@/lib/database/connection";
import { emailVerificationCode } from "@/lib/database/schema";
import { eq } from "drizzle-orm";

const getByEmailAndUserId = async (email: string, userId: string) => {
  try {
    return await db.query.emailVerificationCode.findFirst({
      where(fields, { eq, and, gt }) {
        return and(
          eq(fields.userId, userId),
          eq(fields.email, email),
          gt(fields.expiresAt, new Date().toISOString())
        );
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteByUserId = async (userId: string) => {
  return db
    .delete(emailVerificationCode)
    .where(eq(emailVerificationCode.userId, userId));
};

const emailVerificationCodeRepository = {
  getByEmailAndUserId,
  deleteByUserId,
};

export default emailVerificationCodeRepository;
