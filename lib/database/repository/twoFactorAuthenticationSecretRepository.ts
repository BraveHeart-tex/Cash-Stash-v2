import { eq, InferInsertModel } from "drizzle-orm";
import { twoFactorAuthenticationSecrets } from "@/lib/database/schema";
import { db } from "@/lib/database/connection";
import userRepository from "@/lib/database/repository/userRepository";

type TwoFactorAuthenticationSecretInsertModel = InferInsertModel<
  typeof twoFactorAuthenticationSecrets
>;

const create = async (data: TwoFactorAuthenticationSecretInsertModel) => {
  return db.insert(twoFactorAuthenticationSecrets).values(data);
};

const deleteTwoFactorSecretByUserId = async (userId: string) => {
  return db
    .delete(twoFactorAuthenticationSecrets)
    .where(eq(twoFactorAuthenticationSecrets.userId, userId));
};

const getByUserId = async (userId: string) => {
  const [secret] = await db
    .select()
    .from(twoFactorAuthenticationSecrets)
    .where(eq(twoFactorAuthenticationSecrets.userId, userId))
    .limit(1);

  return secret;
};

const removeTwoFactorAuthenticationSecret = async (userId: string) => {
  await db.transaction(async (trx) => {
    await userRepository.updateUser(userId, {
      prefersTwoFactorAuthentication: 0,
    });
    await deleteTwoFactorSecretByUserId(userId);
  });
};

const twoFactorAuthenticationSecretRepository = {
  create,
  getByUserId,
  removeTwoFactorAuthenticationSecret,
};

export default twoFactorAuthenticationSecretRepository;
