"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PAGES, Page } from "@/lib/utils";
import { MonthlyData } from "@/app/components/ReportsPage/ReportTable";
import { setSelectedTab } from "@/app/redux/features/navigationTabsSlice";

interface INavigationTabsListProps {
  dashboardData: MonthlyData["monthlyTransactionsData"];
}

const NavigationTabsList = ({ dashboardData }: INavigationTabsListProps) => {
  const { selectedTab } = useAppSelector(
    (state) => state.navigationTabsReducer
  );
  const dispatch = useAppDispatch();

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) =>
        dispatch(setSelectedTab({ selectedTab: value as Page }))
      }
      defaultValue={"Dashboard"}
    >
      <div className="overflow-scroll scrollbar-hide">
        <TabsList className="lg:w-auto">
          {PAGES.map((page) => (
            <TabsTrigger key={page.label} value={page.label}>
              {page.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {PAGES.map((page) => {
        return (
          <TabsContent key={page.label} value={page.label}>
            <page.content monthlyTransactionsData={dashboardData ?? []} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default NavigationTabsList;
