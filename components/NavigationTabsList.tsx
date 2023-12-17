"use client";
import { setSelectedTab } from "@/app/redux/features/navigationTabsSlice";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { PAGES, Page } from "@/lib/utils";
import { TabsList, TabsTrigger, Tabs } from "./ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationTabsList = () => {
  const { selectedTab } = useAppSelector(
    (state) => state.navigationTabsReducer
  );
  const pathName = usePathname();
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
              asChild
              value={page.label}
              className={
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-white transition-all"
              }
              data-state={pathName === page.link ? "active" : "inactive"}
              onClick={(e) => {
                e.currentTarget.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
            >
              <Link href={page.link}>
                <page.icon className="w-6 h-6 mr-2" />
                {page.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};

export default NavigationTabsList;
