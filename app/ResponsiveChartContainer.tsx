import { MonthlyData } from "@/app/components/ReportsPage/ReportTable";
import BarChartComponent from "@/components/charts/BarChartComponent";

const ResponsiveChartContainer = ({
  monthlyTransactionsData,
}: Pick<MonthlyData, "monthlyTransactionsData">) => {
  return (
    <div className="flex justify-center items-start flex-col gap-4 mt-10">
      <h3 className="text-4xl mb-4 text-primary">Income vs Expenses</h3>
      {monthlyTransactionsData.length === 0 ? (
        <h2>No data was found to generate the chart</h2>
      ) : (
        <>
          <p>
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

export default ResponsiveChartContainer;
