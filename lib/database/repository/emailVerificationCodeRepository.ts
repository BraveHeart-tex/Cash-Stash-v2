import { db } from "@/lib/database/connection";

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

const emailVerificationCodeRepository = {
  getByEmailAndUserId,
};

export default emailVerificationCodeRepository;
