"use client";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import useAuthStore from "@/store/auth/authStore";
import type { MonthlyTransactionsData } from "@/typings/reports";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

type CustomTooltipProps = TooltipProps<number, string>;

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const preferredCurrency = useAuthStore(
    (state) => state.user?.preferredCurrency,
  );
  if (active && payload && payload.length) {
    return (
      <div className="grid grid-cols-1 gap-2 rounded-md bg-card p-6 shadow-sm">
        <p className="font-semibold text-primary">{`${label}`}</p>
        <p className="text-success">
          <span className="font-semibold">Income: </span>
          {formatMoney(payload[0].value || 0, preferredCurrency)}
        </p>
        <p className="text-destructive">
          <span className="font-semibold">Expense: </span>
          {formatMoney(payload[1].value || 0, preferredCurrency)}
        </p>
      </div>
    );
  }

  return null;
};

type BarChartComponentProps = {
  monthlyTransactionsData: MonthlyTransactionsData[];
};

const BarChartComponent = ({
  monthlyTransactionsData,
}: BarChartComponentProps) => {
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
          content={({ active, label, payload }) => (
            <CustomTooltip
              active={active}
              label={label}
              payload={payload as CustomTooltipProps["payload"]}
            />
          )}
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
