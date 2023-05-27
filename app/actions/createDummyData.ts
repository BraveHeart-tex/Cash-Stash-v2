import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

export default async function createDummyData() {
  try {
    // Create a user
    const user = await getCurrentUser();

    if (!user) {
      return;
    }

    // Create user accounts
    const userAccount1 = await prisma.userAccount.create({
      data: {
        name: 'Savings Account',
        balance: 1000,
        userId: user.id,
      },
    });

    const userAccount2 = await prisma.userAccount.create({
      data: {
        name: 'Checking Account',
        balance: 500,
        userId: user.id,
      },
    });

    // Create transactions
    const transaction1 = await prisma.transaction.create({
      data: {
        amount: 50,
        description: 'Groceries',
        category: 'FOOD',
        accountId: userAccount1.id,
        userId: user.id,
      },
    });

    const transaction2 = await prisma.transaction.create({
      data: {
        amount: 20,
        description: 'Transportation',
        category: 'TRANSPORTATION',
        accountId: userAccount2.id,
        userId: user.id,
      },
    });

    // Create budgets
    const budget1 = await prisma.budget.create({
      data: {
        budgetAmount: 500,
        spentAmount: 100,
        userId: user.id,
        category: 'FOOD',
      },
    });

    const budget2 = await prisma.budget.create({
      data: {
        budgetAmount: 200,
        spentAmount: 50,
        userId: user.id,
        category: 'TRANSPORTATION',
      },
    });

    // Create goals
    const goal1 = await prisma.goal.create({
      data: {
        name: 'Vacation',
        goalAmount: 5000,
        currentAmount: 1000,
        userId: user.id,
      },
    });

    const goal2 = await prisma.goal.create({
      data: {
        name: 'New Car',
        goalAmount: 20000,
        currentAmount: 5000,
        userId: user.id,
      },
    });

    // Create reminders
    const reminder1 = await prisma.reminder.create({
      data: {
        title: 'Pay Rent',
        amount: 1000,
        date: new Date(),
        userId: user.id,
      },
    });

    const reminder2 = await prisma.reminder.create({
      data: {
        title: 'Utility Bill',
        amount: 200,
        date: new Date(),
        userId: user.id,
      },
    });

    console.log('Dummy data created successfully!');
  } catch (error) {
    console.error('Error creating dummy data:', error);
  }
}
