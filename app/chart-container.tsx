import { MonthlyTransactionsData } from "@/actions/types";
import BarChartComponent from "@/components/charts/bar-chart";

const ResponsiveChartContainer = ({
  monthlyTransactionsData,
}: {
  monthlyTransactionsData: MonthlyTransactionsData[];
}) => {
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
