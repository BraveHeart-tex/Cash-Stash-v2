import { PAGES } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getChartDataAction } from "@/actions";

const NavigationTabs = async () => {
  const { data: dashboardData } = await getChartDataAction();
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList defaultValue={PAGES[0].label}>
        {PAGES.map((page) => (
          <TabsTrigger key={page.label} value={page.label}>
            {page.label}
          </TabsTrigger>
        ))}
      </TabsList>
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

export default NavigationTabs;
