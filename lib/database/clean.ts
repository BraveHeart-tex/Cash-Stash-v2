import { db } from "@/lib/database/connection";
import {
  accounts,
  budgets,
  goals,
  sessions,
  transactions,
  twoFactorAuthenticationSecrets,
  users,
} from "@/lib/database/schema";

const clean = async () => {
  if (process.env.NODE_ENV !== "development") return;
  await db.transaction(async (trx) => {
    await Promise.all([
      trx.delete(transactions),
      trx.delete(users),
      trx.delete(budgets),
      trx.delete(goals),
      trx.delete(accounts),
      trx.delete(twoFactorAuthenticationSecrets),
      trx.delete(sessions),
    ]);
  });
};

clean()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("cleaning done!");
    process.exit(0);
  });
