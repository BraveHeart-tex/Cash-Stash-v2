"use client";
import { MonthlyTransactionsData } from "@/actions/types";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import useAuthStore from "@/store/auth/authStore";
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
  const preferredCurrency = useAuthStore(
    (state) => state.user?.preferredCurrency
  );
  if (active && payload && payload.length) {
    return (
      <div className="bg-card shadow-lg rounded-md p-6 grid grid-cols-1 gap-2">
        <p className="text-primary font-semibold">{`${label}`}</p>
        <p className="text-success">
          <span className="font-semibold">Income: </span>
          {formatMoney(payload[0].value, preferredCurrency)}
        </p>
        <p className="text-destructive">
          <span className="font-semibold">Expense: </span>
          {formatMoney(payload[1].value, preferredCurrency)}
        </p>
      </div>
    );
  }

  return null;
};

const BarChartComponent = ({
  monthlyTransactionsData,
}: {
  monthlyTransactionsData: MonthlyTransactionsData[];
}) => {
  if (monthlyTransactionsData.length === 0) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyTransactionsData} className="p-0">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          style={{
            fontFamily: "Sans-Serif",
          }}
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.toLocaleString("default", {
              month: "short",
            })} ${date.getFullYear()}`;
          }}
        />
        <YAxis
          allowDecimals={false}
          style={{
            fontFamily: "Sans-Serif",
          }}
        />
        <Tooltip
          cursor={{ fill: "#374151", opacity: 0.2 }}
          content={<CustomTooltip />}
          labelClassName="text-primary underline"
        />
        <Bar
          dataKey="income"
          barSize={75}
          className="fill-success"
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey="expense"
          barSize={75}
          radius={[2, 2, 0, 0]}
          className="fill-destructive"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
