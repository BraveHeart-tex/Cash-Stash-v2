import { ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import { emailVerificationCode, users } from "@/lib/database/schema";
import { and, eq, lte } from "drizzle-orm";
import { convertISOToMysqlDatetime } from "@/lib/utils/dateUtils/convertISOToMysqlDatetime";

const cronService = {
  async deleteUnverifiedAccounts() {
    try {
      const expirationTimeValue =
        new Date().getTime() -
        ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS * 24 * 60 * 60 * 1000;

      const expirationDateString = convertISOToMysqlDatetime(
        new Date(expirationTimeValue).toISOString()
      );

      await db
        .delete(users)
        .where(
          and(
            eq(users.emailVerified, 0),
            lte(users.createdAt, expirationDateString)
          )
        );

      return true;
    } catch (error) {
      console.error("Error deleting unverified accounts", error);
      return false;
    }
  },
  async deleteExpiredEmailVerificationTokens() {
    try {
      const now = convertISOToMysqlDatetime(new Date().toISOString());

      await db
        .delete(emailVerificationCode)
        .where(lte(emailVerificationCode.expiresAt, now));

      return true;
    } catch (error) {
      console.error("Error deleting expired email verification tokens", error);
      return false;
    }
  },
};

export default cronService;
