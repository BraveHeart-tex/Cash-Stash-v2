import { MonthlyTransactionsData } from "@/actions/types";
import BarChartComponent from "@/components/charts/bar-chart";

const IncomeAndExpenseChart = ({
  monthlyTransactionsData,
}: {
  monthlyTransactionsData: MonthlyTransactionsData[];
}) => {
  return (
    <div className="flex justify-center items-start flex-col gap-4 ">
      <h3 className="text-2xl text-primary">Income vs Expenses</h3>
      {monthlyTransactionsData.length === 0 ? (
        <h2>No data was found to generate the chart</h2>
      ) : (
        <>
          <p className="text-muted-foreground">
            Below chart shows the total income and expenses for the selected
            time
          </p>
          <div className={"w-full h-[400px] flex justify-center items-start"}>
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
