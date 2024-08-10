"use server";
import { FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import { passwordResetTokens } from "@/lib/database/schema";
import { convertISOToMysqlDateTime } from "@/lib/utils/dateUtils/convertISOToMysqlDateTime";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { TimeSpan, createDate } from "oslo";

export const createPasswordResetToken = async (userId: string) => {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));

  const tokenId = generateId(40);
  await db.insert(passwordResetTokens).values({
    id: tokenId,
    userId,
    expiresAt: convertISOToMysqlDateTime(
      createDate(
        new TimeSpan(FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES, "m"),
      ).toISOString(),
    ),
  });

  return tokenId;
};
