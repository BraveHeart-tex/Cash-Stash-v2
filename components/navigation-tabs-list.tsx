"use client";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { TabsList, TabsTrigger, Tabs } from "./ui/tabs";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const NavigationTabsList = () => {
  const pathName = usePathname();

  return (
    <Tabs defaultValue={NAVIGATION_ITEMS[0].label}>
      <div className="overflow-scroll scrollbar-hide hidden lg:block">
        <TabsList className="lg:w-auto">
          {NAVIGATION_ITEMS.map((page) => (
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
