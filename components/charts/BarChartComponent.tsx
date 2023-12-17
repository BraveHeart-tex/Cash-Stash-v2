"use client";
import { MonthlyData } from "@/app/components/ReportsPage/ReportTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card shadow-lg rounded-lg p-6 grid grid-cols-1 gap-2">
        <p className="text-primary font-semibold">{`${label}`}</p>
        <p className="text-success">
          <span className="font-semibold">Income: </span>
          {"$" + payload[0].value}
        </p>
        <p className="text-destructive">
          <span className="font-semibold">Expense: </span>
          {"$" + payload[1].value}
        </p>
      </div>
    );
  }

  return null;
};

const BarChartComponent = ({
  monthlyTransactionsData,
}: Pick<MonthlyData, "monthlyTransactionsData">) => {
  if (monthlyTransactionsData.length === 0) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyTransactionsData} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.toLocaleString("default", {
              month: "short",
            })} ${date.getFullYear()}`;
          }}
        />
        <YAxis allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "#374151", opacity: 0.3 }}
          content={<CustomTooltip />}
          labelClassName="text-primary"
        />
        <Bar
          dataKey="income"
          barSize={75}
          className="fill-success"
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="expense"
          barSize={75}
          radius={[10, 10, 0, 0]}
          className="dark:fill-red-700 fill-destructive"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
