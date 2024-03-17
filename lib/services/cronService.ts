import { ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import { users } from "@/lib/database/schema";
import { and, eq, lte } from "drizzle-orm";
import { convertIsoToMysqlDatetime } from "@/lib/utils/dateUtils/convertIsoToMysqlDatetime";

const cronService = {
  async deleteUnverifiedAccounts() {
    try {
      const expirationTimeValue =
        new Date().getTime() -
        ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS * 24 * 60 * 60 * 1000;

      const expirationDateString = convertIsoToMysqlDatetime(
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
};

export default cronService;
