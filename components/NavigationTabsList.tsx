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

  const itemVariants = {
    active: {
      scale: 1.05,
      opacity: 1,
    },
    inactive: { scale: 1, opacity: 0.8 },
  };
  const transition = { duration: 0.5 };

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
          {PAGES.map((page, index) => (
            <motion.div
              key={page.label + index}
              onClick={(e) => {
                e.currentTarget.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              animate={pathName === page.link ? "active" : "inactive"}
              variants={itemVariants}
              initial="inactive"
              transition={transition}
            >
              <TabsTrigger
                key={page.label}
                asChild
                value={page.label}
                className={
                  "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-white transition-all"
                }
                data-state={pathName === page.link ? "active" : "inactive"}
              >
                <Link href={page.link}>
                  <page.icon className="w-6 h-6 mr-2" />
                  {page.label}
                </Link>
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};

export default NavigationTabsList;
