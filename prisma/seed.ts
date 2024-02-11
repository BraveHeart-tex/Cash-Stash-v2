"use server";

import { UserAccountCategory } from "@prisma/client";
import prisma from "../lib/prismadb";
import { faker } from "@faker-js/faker";
import CreateUserAccountOptions from "../lib/CreateUserAccountOptions";

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

  const accountOptions = Object.keys(CreateUserAccountOptions);
  for (let i = 0; i < 20; i++) {
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
