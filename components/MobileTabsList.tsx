"use client";
import { PAGES } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MobileTabsList = () => {
  const router = useRouter();

  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/signup"))
    return null;

  return (
    <div className="flex flex-row lg:hidden items-center gap-4 overflow-y-auto fixed bottom-0 left-0 w-full bg-muted font-medium h-[70px] z-[10]">
      {PAGES.map((page, index) => (
        <button
          type="button"
          aria-label={`Navigate to the ${page.label} page`}
          key={index}
          data-state={pathname === page.link ? "active" : "inactive"}
          className="relative cursor-pointer  flex flex-col items-center gap-2 p-2 h-full text-muted-foreground data-[state=active]:text-white data-[state=active]:bg-transparent"
          onClick={(e) => {
            e.currentTarget.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            router.push(page.link);
          }}
        >
          <div>
            {pathname === page.link && (
              <motion.div
                layoutId="mobile-active-pill"
                className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-primary/70"
              />
            )}
            <span
              className={"relative flex flex-col items-center dark:text-white"}
            >
              <page.icon className="w-5 h-5" />
              {page.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
export default MobileTabsList;
