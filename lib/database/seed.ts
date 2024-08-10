import { db } from "@/lib/database/connection";
import { accounts, budgets, goals, transactions } from "@/lib/database/schema";
import logger from "@/lib/utils/logger";
import { faker } from "@faker-js/faker";

// TODO: Fix seed functionality with dynamic values instead
// FIXME: Use bulk insert instead of multiple inserts

const SEED_USER_ID = "jci4b5yqcf1h09ftpze4lvu7";
const transactionCategoryId = 110;
const budgetCategoryId = 111;

const seed = async () => {
  await db.transaction(async (trx) => {
    for (let i = 0; i < 50; i++) {
      const [{ insertId: accountId }] = await trx.insert(accounts).values({
        balance: faker.number.int({ min: 0, max: 1000 }),
        name: faker.finance.accountName(),
        userId: SEED_USER_ID,
        category: faker.helpers.arrayElement(accounts.category.enumValues),
      });
      await Promise.all([
        trx.insert(transactions).values({
          accountId,
          amount: faker.number.int({ min: -100, max: 1000 }),
          description: faker.lorem.sentence(),
          userId: SEED_USER_ID,
          categoryId: transactionCategoryId,
        }),
        trx.insert(budgets).values({
          budgetAmount: faker.number.int({ min: 0, max: 1000 }),
          categoryId: budgetCategoryId,
          name: faker.lorem.word(),
          progress: faker.number.int({ min: 0, max: 100 }),
          spentAmount: faker.number.int({ min: 0, max: 1000 }),
          userId: SEED_USER_ID,
        }),
        trx.insert(goals).values({
          currentAmount: faker.number.int({ min: 0, max: 1000 }),
          goalAmount: faker.number.int({ min: 0, max: 1000 }),
          name: faker.lorem.word(),
          progress: faker.number.int({ min: 0, max: 100 }),
          userId: SEED_USER_ID,
        }),
      ]);
    }
  });
};

seed()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.info("Database seeded successfully.");
    process.exit(0);
  });
