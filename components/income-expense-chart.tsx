import BarChartComponent from "@/components/charts/bar-chart";
import { MonthlyTransactionsData } from "@/typings/reports";

type IncomeAndExpenseChartProps = {
  monthlyTransactionsData: MonthlyTransactionsData[];
};

const IncomeAndExpenseChart = ({
  monthlyTransactionsData,
}: IncomeAndExpenseChartProps) => {
  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight text-primary">
        Income vs Expenses
      </h3>
      {monthlyTransactionsData.length === 0 ? (
        <h2>No data was found to generate the chart</h2>
      ) : (
        <>
          <p className="text-muted-foreground">
            Below chart shows the total income and expenses for the selected
            time
          </p>
          <div
            className={"mt-4 flex h-[400px] w-full items-start justify-center"}
          >
            <BarChartComponent
              monthlyTransactionsData={monthlyTransactionsData}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default IncomeAndExpenseChart;
