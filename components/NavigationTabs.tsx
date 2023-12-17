import { getChartDataAction } from "@/actions";
import NavigationTabsList from "./NavigationTabsList";
import { MonthlyData } from "@/app/components/ReportsPage/ReportTable";
import MobileTabsList from "./MobileTabsList";

const NavigationTabs = async () => {
  const { data: dashboardData } = await getChartDataAction();

  return (
    <div className="p-1 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <NavigationTabsList
        dashboardData={dashboardData as MonthlyData["monthlyTransactionsData"]}
      />
      <MobileTabsList />
    </div>
  );
};

export default NavigationTabs;
