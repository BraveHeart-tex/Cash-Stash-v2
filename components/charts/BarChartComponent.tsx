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

const BarChartComponent = ({ monthlyTransactionsData }: MonthlyData) => {
  console.log(monthlyTransactionsData);

  if (monthlyTransactionsData.length === 0) {
    return <div>No data to display.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyTransactionsData} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="income" barSize={75} fill="#69db7c" />
        <Bar dataKey="expense" barSize={75} fill="#f03e3e" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
