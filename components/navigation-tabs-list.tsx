"use client";
import { setSelectedTab } from "@/app/redux/features/navigationTabsSlice";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { PAGES, Page } from "@/lib/utils";
import { TabsList, TabsTrigger, Tabs } from "./ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NavigationTabsList = () => {
  const { selectedTab } = useAppSelector(
    (state) => state.navigationTabsReducer
  );
  const pathName = usePathname();
  const dispatch = useAppDispatch();

  if (pathName.startsWith("/login") || pathName.startsWith("/signup"))
    return null;

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) =>
        dispatch(setSelectedTab({ selectedTab: value as Page }))
      }
      defaultValue={selectedTab}
    >
      <div className="overflow-scroll scrollbar-hide hidden lg:block">
        <TabsList className="lg:w-auto">
          {PAGES.map((page) => (
            <TabsTrigger
              key={page.label}
              asChild
              value={page.label}
              className={
                "relative data-[state=active]:text-white data-[state=active]:bg-transparent"
              }
              data-state={pathName === page.link ? "active" : "inactive"}
            >
              <Link href={page.link}>
                {pathName === page.link && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 "
                    style={{
                      borderRadius: "9999px",
                    }}
                  />
                )}
                <span className={`flex items-center relative z-10`}>
                  <page.icon className={"w-6 h-6 mr-1"} />
                  {page.label}
                </span>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};

export default NavigationTabsList;
