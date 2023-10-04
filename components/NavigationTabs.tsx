import { PAGES } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const NavigationTabs = () => {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        {PAGES.map((page) => (
          <TabsTrigger key={page.label} value={page.label}>
            {page.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PAGES.map((page) => (
        <TabsContent key={page.label} value={page.label}>
          {page.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default NavigationTabs;
