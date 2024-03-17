import { db } from "@/lib/database/connection";
import { passwordResetTokens } from "@/lib/database/schema";
import { eq } from "drizzle-orm";

const getByToken = async (token: string) => {
  const [passwordResetToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.id, token));

  return passwordResetToken;
};

const deleteByToken = async (token: string) => {
  return db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, token));
};

const passwordResetTokenRepository = {
  getByToken,
  deleteByToken,
};

export default passwordResetTokenRepository;
