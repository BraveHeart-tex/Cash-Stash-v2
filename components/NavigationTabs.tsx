import { PAGES } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getChartDataAction } from "@/actions";

const NavigationTabs = async () => {
  const { data: dashboardData } = await getChartDataAction();
  return (
    <div className="p-8">
      <Tabs defaultValue={PAGES[0].label}>
        <TabsList className="mr-12 w-full md:w-auto justify-start overflow-x-auto overflow-y-hidden scrollbar-hide">
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
    </div>
  );
};

export default NavigationTabs;
