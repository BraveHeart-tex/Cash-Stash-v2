import { db } from "@/lib/database/connection";
import userRepository from "@/lib/database/repository/userRepository";
import { twoFactorAuthenticationSecrets } from "@/lib/database/schema";
import { type InferInsertModel, eq } from "drizzle-orm";

type TwoFactorAuthenticationSecretInsertModel = InferInsertModel<
  typeof twoFactorAuthenticationSecrets
>;

const twoFactorAuthenticationSecretRepository = {
  async create(data: TwoFactorAuthenticationSecretInsertModel) {
    return db.insert(twoFactorAuthenticationSecrets).values(data);
  },
  async getByUserId(userId: string) {
    const [secret] = await db
      .select()
      .from(twoFactorAuthenticationSecrets)
      .where(eq(twoFactorAuthenticationSecrets.userId, userId))
      .limit(1);

    return secret;
  },
  async removeTwoFactorAuthenticationSecret(userId: string) {
    // FIXME: This is not transactional
    await db.transaction(async (trx) => {
      await userRepository.updateUser(userId, {
        prefersTwoFactorAuthentication: 0,
      });
      await this.deleteByUserId(userId);
    });
  },
  async deleteByUserId(userId: string) {
    return db
      .delete(twoFactorAuthenticationSecrets)
      .where(eq(twoFactorAuthenticationSecrets.userId, userId));
  },
};

export default twoFactorAuthenticationSecretRepository;
