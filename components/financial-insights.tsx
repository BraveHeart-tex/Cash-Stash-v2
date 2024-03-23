"use client";
import { InsightsData } from "@/actions/types";
import { Button } from "@/components/ui/button";
import { FaMoneyBill } from "react-icons/fa";
import Link from "next/link";
import MotionDiv from "@/components/animations/motion-div";
import { PAGE_ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils/stringUtils/cn";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";

interface IFinancialInsightsProps {
  insightsData: InsightsData | null;
}

const SavingsRate = ({ value }: { value: number }) => (
  <div className="mb-4 flex flex-col">
    <h3 className="font-semibold text-lg">Savings Rate</h3>
    <p>{value}%</p>
    <p
      className={cn(
        "font-semibold",
        value > 0 ? "text-success" : "text-destructive"
      )}
    >
      {value > 0
        ? "You are saving more than you are spending!"
        : "You are spending more than you are saving!"}
    </p>
  </div>
);

// TODO: Refactor majority of the logic to server side
// only show the stats for this month here
// and add vs last month if data is available
const FinancialInsights = ({ insightsData }: IFinancialInsightsProps) => {
  const noInsightsData = Object.keys(insightsData || {}).length === 0;

  const NoDataMessage = () => (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 gap-4 text-primary"
    >
      <p>No data was found to generate financial insights from.</p>
    </MotionDiv>
  );

  if (!insightsData) return <NoDataMessage />;

  if (noInsightsData || (insightsData && !insightsData.totalIncome)) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div className="my-3">
          <NoDataMessage />
          <Link href={PAGE_ROUTES.TRANSACTIONS_ROUTE}>
            <Button className="font-semibold  mt-3 flex items-center gap-[14px]">
              <FaMoneyBill size={18} />
              Go To Transactions
            </Button>
          </Link>
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
          <Button className="font-semibold  mt-3 hover:bg-foreground hover:text-muted">
            <Link href={PAGE_ROUTES.TRANSACTIONS_ROUTE}>
              Go To Transactions
            </Link>
          </Button>
        </div>
      </article>
    );
  }

  return (
    <div className="grid grid-cols-2">
      {mappedData.map((data) =>
        data.name === "Savings Rate" ? (
          <SavingsRate key={data.name} value={data.value as number} />
        ) : (
          <div className="mb-4 flex flex-col" key={data.name}>
            <h3 className="font-bold text-lg">{data.name}</h3>
            <p>{formatMoney(+data.value)}</p>
          </div>
        )
      )}
    </div>
  );
};

export default FinancialInsights;
