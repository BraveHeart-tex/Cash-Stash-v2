"use client";
import { MonthlyData } from "@/app/components/ReportsPage/ReportTable";
import { setSelectedTab } from "@/app/redux/features/navigationTabsSlice";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { PAGES, Page } from "@/lib/utils";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "./ui/tabs";

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
      <div className="overflow-scroll scrollbar-hide hidden lg:block">
        <TabsList className="lg:w-auto">
          {PAGES.map((page) => (
            <TabsTrigger
              key={page.label}
              value={page.label}
              className={
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-white transition-all"
              }
            >
              {/* @ts-ignore */}
              <page.icon className="w-6 h-6 mr-2" />
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
