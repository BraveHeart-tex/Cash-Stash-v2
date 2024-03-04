"use server";

import { BudgetCategory, AccountCategory, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const createAccount = async (userId: string) => {
  const accountOptions = Object.keys(AccountCategory);

  const accountType = accountOptions[
    Math.floor(Math.random() * accountOptions.length)
  ] as AccountCategory;

  await prisma.account.create({
    data: {
      userId,
      name: faker.finance.accountName(),
      balance: faker.number.float({ min: 0, max: 10000, precision: 3 }),
      category: accountType,
    },
  });
};

const createBudget = async (userId: string) => {
  const budgetOptions = Object.keys(BudgetCategory);
  const budgetType = budgetOptions[
    Math.floor(Math.random() * budgetOptions.length)
  ] as BudgetCategory;
  await prisma.budget.create({
    data: {
      userId,
      name: faker.finance.accountName() + " Budget",
      budgetAmount: faker.number.float({ min: 0, max: 10000, precision: 3 }),
      category: budgetType,
      spentAmount: faker.number.float({ min: 0, max: 10000, precision: 3 }),
    },
  });
};

const createGoal = async (userId: string) => {
  await prisma.goal.create({
    data: {
      userId,
      name: faker.finance.accountName() + " Goal",
      goalAmount: faker.number.float({ min: 0, max: 10000, precision: 3 }),
      currentAmount: faker.number.float({ min: 0, max: 10000, precision: 3 }),
    },
  });
};

async function main() {
  const userId = "clt9rtgxm0003dz6poaf1oshv";

  await prisma.account.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.goal.deleteMany();

  for (let i = 0; i < 1000000; i++) {
    await Promise.all([
      createAccount(userId),
      createBudget(userId),
      createGoal(userId),
    ]);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
