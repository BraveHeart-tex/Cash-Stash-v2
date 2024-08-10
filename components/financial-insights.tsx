"use client";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/lib/constants";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { cn } from "@/lib/utils/stringUtils/cn";
import { Link } from "@/navigation";
import useAuthStore from "@/store/auth/authStore";
import type { InsightsData } from "@/typings/reports";
import { FaMoneyBill } from "react-icons/fa";

type FinancialInsightsProps = {
  insightsData: InsightsData | null;
};

const SavingsRate = ({ value }: { value: number }) => (
  <div className="mb-4 flex flex-col">
    <h3 className="text-lg font-semibold">Savings Rate</h3>
    <p>{value}%</p>
    <p
      className={cn(
        "font-semibold",
        value > 0 ? "text-success" : "text-destructive",
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
const FinancialInsights = ({ insightsData }: FinancialInsightsProps) => {
  const preferredCurrency = useAuthStore(
    (state) => state.user?.preferredCurrency,
  );
  const noInsightsData = Object.keys(insightsData || {}).length === 0;

  const NoDataMessage = () => (
    <p className="text-primary">
      No data was found to generate financial insights from.
    </p>
  );

  if (!insightsData) return <NoDataMessage />;

  if (noInsightsData || (insightsData && !insightsData.totalIncome)) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div className="my-3 flex flex-col items-center justify-center">
          <NoDataMessage />
          <Link href={PAGE_ROUTES.TRANSACTIONS_ROUTE}>
            <Button className="mt-3  flex items-center gap-[14px] font-semibold">
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
    (data) => Number.parseFloat(data.value as string) === 0,
  );

  if (isAllZero) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div className="my-3">
          <NoDataMessage />
          <Button className="mt-3  font-semibold hover:bg-foreground hover:text-muted">
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
            <h3 className="text-lg font-bold">{data.name}</h3>
            <p>{formatMoney(+data.value, preferredCurrency)}</p>
          </div>
        ),
      )}
    </div>
  );
};

export default FinancialInsights;
