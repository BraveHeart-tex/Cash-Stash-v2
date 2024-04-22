import { db } from "@/lib/database/connection";
import { emailVerificationCode } from "@/lib/database/schema";
import { convertISOToMysqlDatetime } from "@/lib/utils/dateUtils/convertISOToMysqlDatetime";
import { eq, lte } from "drizzle-orm";
import logger from "@/lib/utils/logger";

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
    const now = convertISOToMysqlDatetime(new Date().toISOString());

    return await db
      .delete(emailVerificationCode)
      .where(lte(emailVerificationCode.expiresAt, now));
  },
};

export default emailVerificationCodeRepository;
