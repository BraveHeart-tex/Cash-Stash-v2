"use client";
import { PAGES, PAGE_ROUTES } from "@/lib/constants";
import { usePathname } from "next/navigation";
import MobileTabsListItem from "./mobile-tab-list-item";
import useAuthStore from "@/store/auth/authStore";

const MobileTabsList = () => {
  const userInState = useAuthStore((state) => state.user);
  const pathname = usePathname();

  if (
    !userInState ||
    pathname.startsWith(PAGE_ROUTES.LOGIN_ROUTE) ||
    pathname.startsWith(PAGE_ROUTES.SIGN_UP_ROUTE)
  )
    return null;

  return (
    <nav
      role="navigation"
      className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border lg:hidden scrollbar-hide"
    >
      <div className="flex items-center justify-between h-full font-medium overflow-auto scrollbar-hide">
        {PAGES.map((page) => (
          <MobileTabsListItem key={page.link} page={page} />
        ))}
      </div>
    </nav>
  );
};
export default MobileTabsList;
