import { db } from "@/lib/database/connection";
import { accounts, budgets, goals, transactions } from "@/lib/database/schema";
import { faker } from "@faker-js/faker";
import logger from "@/lib/utils/logger";

const USER_ID = "um3kgd74zu4f3eltxzh68wos";

const seed = async () => {
  await db.transaction(async (trx) => {
    for (let i = 0; i < 50; i++) {
      const [{ insertId: accountId }] = await trx.insert(accounts).values({
        balance: faker.number.int({ min: 0, max: 1000 }),
        name: faker.finance.accountName(),
        userId: USER_ID,
        category: faker.helpers.arrayElement(accounts.category.enumValues),
      });
      await Promise.all([
        trx.insert(transactions).values({
          accountId,
          amount: faker.number.int({ min: -100, max: 1000 }),
          description: faker.lorem.sentence(),
          userId: USER_ID,
          categoryId: 1,
        }),
        trx.insert(budgets).values({
          budgetAmount: faker.number.int({ min: 0, max: 1000 }),
          categoryId: 1,
          name: faker.lorem.word(),
          progress: faker.number.int({ min: 0, max: 100 }),
          spentAmount: faker.number.int({ min: 0, max: 1000 }),
          userId: USER_ID,
        }),
        trx.insert(goals).values({
          currentAmount: faker.number.int({ min: 0, max: 1000 }),
          goalAmount: faker.number.int({ min: 0, max: 1000 }),
          name: faker.lorem.word(),
          progress: faker.number.int({ min: 0, max: 100 }),
          userId: USER_ID,
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
  .finally(async () => {
    console.log("Seeding done!");
    process.exit(0);
  });
