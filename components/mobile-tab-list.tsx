"use client";
import { PAGES } from "@/lib/utils";
import { usePathname } from "next/navigation";
import MobileTabsListItem from "./mobile-tab-list-item";

const MobileTabsList = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/signup"))
    return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border lg:hidden">
      <div className="flex items-center justify-between h-full font-medium overflow-auto scrollbar-hide">
        {PAGES.map((page) => (
          <MobileTabsListItem key={page.link} page={page} />
        ))}
      </div>
    </div>
  );
};
export default MobileTabsList;
