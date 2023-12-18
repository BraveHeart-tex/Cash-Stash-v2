"use client";
import { setSelectedTab } from "@/app/redux/features/navigationTabsSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import { PAGES } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MobileTabsList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/signup"))
    return null;

  return (
    <div className="flex flex-row lg:hidden items-center gap-4 overflow-y-auto fixed bottom-0 left-0 w-full bg-muted font-medium h-[70px] z-[10]">
      {PAGES.map((page, index) => (
        <motion.button
          type="button"
          aria-label={`Navigate to the ${page.label} page`}
          key={index}
          data-state={pathname === page.link ? "active" : "inactive"}
          className="cursor-pointer flex flex-col items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-white transition-all p-2 h-full text-muted-foreground"
          onClick={(e) => {
            dispatch(setSelectedTab({ selectedTab: page.label }));
            e.currentTarget.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            router.push(page.link);
          }}
          whileTap={{
            scale: 0.85,
          }}
        >
          <div className="flex flex-col items-center">
            <page.icon className="w-5 h-5" />
            {page.label}
          </div>
        </motion.button>
      ))}
    </div>
  );
};
export default MobileTabsList;
