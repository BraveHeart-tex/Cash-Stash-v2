"use client";
import { InsightsData } from "@/app/redux/features/transactionsSlice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "../redux/hooks";
import { setSelectedTab } from "../redux/features/navigationTabsSlice";
import { FaMoneyBill } from "react-icons/fa";

interface IFinancialInsightsProps {
  insightsData: InsightsData | null;
}

const NoDataMessage = () => (
  <div className="grid grid-cols-1 gap-4 text-primary">
    <p>No data was found to generate financial insights from.</p>
  </div>
);

const SavingsRate = ({ value }: { value: number }) => (
  <div className="mb-4 flex flex-col">
    <h3 className="font-semibold text-lg">Savings Rate</h3>
    <p>{value}%</p>
    <p
      className={cn(
        "font-semibold",
        value > 0 ? "text-green-500" : "text-red-500"
      )}
    >
      {value > 0
        ? "You are saving more than you are spending!"
        : "You are spending more than you are saving!"}
    </p>
  </div>
);

const FinancialInsights = ({ insightsData }: IFinancialInsightsProps) => {
  const dispatch = useAppDispatch();
  const noInsightsData = Object.keys(insightsData || {}).length === 0;

  if (!insightsData) return <NoDataMessage />;

  if (noInsightsData || (insightsData && !insightsData.totalIncome)) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div className="my-3">
          <NoDataMessage />
          <Button
            className="font-semibold text-md mt-3 flex items-center gap-[14px]"
            onClick={() =>
              dispatch(setSelectedTab({ selectedTab: "Transactions" }))
            }
          >
            <FaMoneyBill size={18} />
            Go To Transactions
          </Button>
        </div>
      </article>
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

  const isAllZero = mappedData.every(
    (data) => parseFloat(data.value as string) === 0
  );

  if (isAllZero) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div className="my-3">
          <NoDataMessage />
          <Button
            className="font-semibold text-md mt-3 hover:bg-foreground hover:text-muted"
            onClick={() =>
              dispatch(setSelectedTab({ selectedTab: "Transactions" }))
            }
          >
            Transactions
          </Button>
        </div>
      </article>
    );
  }

  const thousandSeparator = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="grid grid-cols-2">
      {mappedData.map((data) =>
        data.name === "Savings Rate" ? (
          <SavingsRate key={data.name} value={data.value as number} />
        ) : (
          <div className="mb-4 flex flex-col" key={data.name}>
            <h3 className="font-bold text-lg">{data.name}</h3>
            <p>{thousandSeparator(data.value as number)}₺</p>
          </div>
        )
      )}
    </div>
  );
};

export default FinancialInsights;
