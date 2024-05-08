"use server";
import { TimeSpan, createDate } from "oslo";
import { FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES } from "@/lib/constants";
import { generateId } from "lucia";
import { db } from "@/lib/database/connection";
import { passwordResetTokens } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { convertISOToMysqlDatetime } from "@/lib/utils/dateUtils/convertISOToMysqlDatetime";

export const createPasswordResetToken = async (userId: string) => {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));

  const tokenId = generateId(40);
  await db.insert(passwordResetTokens).values({
    id: tokenId,
    userId,
    expiresAt: convertISOToMysqlDatetime(
      createDate(
        new TimeSpan(FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES, "m")
      ).toISOString()
    ),
  });

  return tokenId;
};
