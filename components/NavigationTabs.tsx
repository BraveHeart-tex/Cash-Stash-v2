import NavigationTabsList from "./NavigationTabsList";
import MobileTabsList from "./MobileTabsList";

const NavigationTabs = () => {
  return (
    <div className="p-1 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <NavigationTabsList />
      <MobileTabsList />
    </div>
  );
};

export default NavigationTabs;
