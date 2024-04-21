import NavigationTabsList from "@/components/navigation-tabs-list";
import MobileTabsList from "@/components/mobile-tab-list";

const NavigationTabs = () => {
  return (
    <div className="mx-auto p-1 lg:max-w-[1300px] lg:p-4 xl:max-w-[1600px]">
      <NavigationTabsList />
      <MobileTabsList />
    </div>
  );
};

export default NavigationTabs;
