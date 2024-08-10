import { db } from "@/lib/database/connection";
import { emailVerificationCode } from "@/lib/database/schema";
import { convertISOToMysqlDateTime } from "@/lib/utils/dateUtils/convertISOToMysqlDateTime";
import logger from "@/lib/utils/logger";
import { eq, lte } from "drizzle-orm";

const getByEmailAndUserId = async (email: string, userId: string) => {
  try {
    return await db.query.emailVerificationCode.findFirst({
      where(fields, { eq, and, gt }) {
        return and(
          eq(fields.userId, userId),
          eq(fields.email, email),
          gt(fields.expiresAt, new Date().toISOString()),
        );
      },
    });
  } catch (error) {
    logger.error(error);
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
  async deleteExpiredCodes() {
    const now = convertISOToMysqlDateTime(new Date().toISOString());

    return await db
      .delete(emailVerificationCode)
      .where(lte(emailVerificationCode.expiresAt, now));
  },
};

export default emailVerificationCodeRepository;
