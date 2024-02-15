"use server";

import { NotificationCategory, UserAccountCategory } from "@prisma/client";
import prisma from "../lib/prismadb";
import { faker } from "@faker-js/faker";
import CreateUserAccountOptions from "../lib/CreateUserAccountOptions";
import CreateBudgetOptions from "../lib/CreateBudgetOptions";

const createAccount = async (userId: string) => {
  const accountOptions = Object.keys(CreateUserAccountOptions);

  const accountType = accountOptions[
    Math.floor(Math.random() * accountOptions.length)
  ] as UserAccountCategory;

  await prisma.userAccount.create({
    data: {
      userId,
      name: faker.finance.accountName(),
      balance: faker.number.float({ min: 0, max: 10000, precision: 3 }),
      category: accountType,
    },
  });
};

const createBudget = async (userId: string) => {
  const budgetOptions = Object.keys(CreateBudgetOptions);
  const budgetType = budgetOptions[
    Math.floor(Math.random() * budgetOptions.length)
  ] as NotificationCategory;
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

async function main() {
  console.time("seed");
  const user = await prisma.user.findUnique({
    where: {
      email: "testUser@email.com",
    },
  });
  const userId = user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  await prisma.userAccount.deleteMany();
  await prisma.budget.deleteMany();

  for (let i = 0; i < 40; i++) {
    await createAccount(userId);
    await createBudget(userId);
  }

  console.timeEnd("seed");
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
