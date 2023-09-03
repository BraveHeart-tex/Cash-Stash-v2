"use client";
import Navigation from "../components/Navigation";
import ReportTable from "../components/ReportsPage/ReportTable";

const ReportsPageClient = () => {
  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <Navigation />
      <h3 className="text-4xl mb-4 text-primary">Reports</h3>
      <ReportTable />
    </div>
  );
};

export default ReportsPageClient;
