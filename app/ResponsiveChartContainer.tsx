"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MonthlyData } from "@/app/components/ReportsPage/ReportTable";
import BarChartComponent from "@/components/charts/BarChartComponent";
import AreaChartComponent from "@/components/charts/AreaChartComponent";

const ResponsiveChartContainer = ({ monthlyTransactionsData }: MonthlyData) => {
  const [chartType, setChartType] = useState<"bar" | "area">("bar");

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <h3 className="text-4xl mb-4 text-primary">Income vs Expenses</h3>
      <p>
        Below chart shows the total income and expenses for the selected time
      </p>
      <div className="flex justify-center items-center gap-4 flex-col lg:flex-row">
        <p>Change Chart Type:</p>
        <div className="flex items-center gap-4">
          <Button className="font-semibold" onClick={() => setChartType("bar")}>
            Bar
          </Button>
          <Button
            className="font-semibold"
            onClick={() => setChartType("area")}
          >
            Area
          </Button>
        </div>
      </div>

      <div className={"w-full h-[400px] flex justify-center items-center"}>
        {chartType === "bar" ? (
          <BarChartComponent
            monthlyTransactionsData={monthlyTransactionsData}
          />
        ) : (
          <AreaChartComponent
            monthlyTransactionsData={monthlyTransactionsData}
          />
        )}
      </div>
    </div>
  );
};

export default ResponsiveChartContainer;
