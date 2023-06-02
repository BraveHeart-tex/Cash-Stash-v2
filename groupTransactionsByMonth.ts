import { MonthlyTransactionData } from './app/redux/features/transactionsSlice';

export default function groupTransactionsByMonth(
  transactions: { month: string; amount: number }[]
) {
  const groupedTransactions: MonthlyTransactionData = {
    incomes: [],
    expenses: [],
  };

  transactions.forEach((transaction) => {
    const { month, amount } = transaction;

    if (groupedTransactions.incomes.some((income) => income.month === month)) {
      // Add the amount to the existing income for the month
      const existingIncome = groupedTransactions.incomes.find(
        (income) => income.month === month
      );
      if (existingIncome) {
        existingIncome.amount += amount;
      }
    } else {
      // Create a new income for the month
      groupedTransactions.incomes.push({ month, amount });
    }
  });

  return groupedTransactions;
}

console.log(
  groupTransactionsByMonth([
    { month: 'January', amount: 1000 },
    { month: 'February', amount: 2000 },
    { month: 'March', amount: 3000 },
    { month: 'January', amount: 500 },
    { month: 'February', amount: 1000 },
    { month: 'March', amount: 1500 },
  ])
);
