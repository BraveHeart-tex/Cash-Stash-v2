"use client";
import ReportTable, {
  MonthlyData,
} from "../components/ReportsPage/ReportTable";

const ReportsPageClient = ({ monthlyTransactionsData }: MonthlyData) => {
  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <h3 className="text-4xl mb-4 text-primary">Reports</h3>
      <ReportTable monthlyTransactionsData={monthlyTransactionsData} />
    </div>
  );
};

export default ReportsPageClient;
