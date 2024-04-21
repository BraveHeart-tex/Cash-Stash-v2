"use client";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const NavigationTabsList = () => {
  const pathName = usePathname();

  return (
    <Tabs defaultValue={NAVIGATION_ITEMS[0].label}>
      <div className="scrollbar-hide hidden overflow-scroll lg:block">
        <TabsList className="lg:w-auto">
          {NAVIGATION_ITEMS.map((page) => (
            <TabsTrigger
              key={page.label}
              asChild
              value={page.label}
              className={
                "relative data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground"
              }
              data-state={pathName === page.link ? "active" : "inactive"}
            >
              <Link href={page.link}>
                {pathName === page.link && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-primary/70"
                  />
                )}
                <span className={`relative z-10 flex items-center`}>
                  <page.icon className={"mr-1 h-6 w-6"} />
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
