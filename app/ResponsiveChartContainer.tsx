import { MonthlyData } from "@/app/components/ReportsPage/ReportTable";
import BarChartComponent from "@/components/charts/BarChartComponent";

const ResponsiveChartContainer = ({ monthlyTransactionsData }: MonthlyData) => {
  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <h3 className="text-4xl mb-4 text-primary">Income vs Expenses</h3>
      <p>
        Below chart shows the total income and expenses for the selected time
      </p>
      <div className={"w-full h-[400px] flex justify-center items-center"}>
        <BarChartComponent monthlyTransactionsData={monthlyTransactionsData} />
      </div>
    </div>
  );
};

export default ResponsiveChartContainer;
