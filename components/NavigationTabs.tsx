import { getChartDataAction } from "@/actions";
import NavigationTabsList from "./NavigationTabsList";
import { MonthlyData } from "@/app/components/ReportsPage/ReportTable";

const NavigationTabs = async () => {
  const { data: dashboardData } = await getChartDataAction();

  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <NavigationTabsList
        dashboardData={dashboardData as MonthlyData["monthlyTransactionsData"]}
      />
    </div>
  );
};

export default NavigationTabs;
