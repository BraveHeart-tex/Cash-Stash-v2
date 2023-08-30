"use client";
import { InsightsData } from "@/app/redux/features/transactionsSlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IFinancialInsightsProps {
  insightsData: InsightsData | null;
}

const FinancialInsights = ({ insightsData }: IFinancialInsightsProps) => {
  if (!insightsData) {
    return (
      <div className="my-3" my>
        <div className="grid grid-cols-1 gap-4 text-primary">
          <p>No data was found to generate financial insights from.</p>
          <p>
            Please make sure you have transactions to generate the necessary
            data.
          </p>
        </div>
        <Link className="mt-3" href="/transactions">
          <Button
            className="font-bold text-md mt-3 hover:bg-foreground hover:text-muted"
            variant="secondary"
          >
            Transactions
          </Button>
        </Link>
      </div>
    );
  }

  const { totalIncome, totalExpense, netIncome, savingsRate } = insightsData;

  const mappedData = [
    {
      name: "Total Income",
      value: totalIncome,
    },
    {
      name: "Total Expenses",
      value: totalExpense,
    },
    {
      name: "Net Income",
      value: netIncome,
    },
    {
      name: "Savings Rate",
      value: savingsRate,
    },
  ];

  return (
    <div className="grid grid-cols-2">
      {mappedData.map((data) => {
        if (data.name === "Savings Rate") {
          return (
            <div className="mb-4 flex flex-col" key={data.name}>
              <h3 className="font-bold text-lg">{data.name}</h3>
              <p>{data.value}%</p>
              <p
                className={cn(
                  "font-bold",
                  parseInt(data.value as string) > 0
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {parseInt(data.value as string) > 0
                  ? "You are saving more than you are spending!"
                  : "You are spending more than you are saving!"}
              </p>
            </div>
          );
        } else {
          return (
            <div className="mb-4 flex flex-col" key={data.name}>
              <h3 className="font-bold text-lg">{data.name}</h3>
              <p>{data.value}₺</p>
            </div>
          );
        }
      })}
    </div>
  );
};

export default FinancialInsights;
