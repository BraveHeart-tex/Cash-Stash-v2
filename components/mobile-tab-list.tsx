"use client";
import MobileTabsListItem from "@/components/mobile-tab-list-item";
import NavigationItemsDrawer from "@/components/navigation-items-drawer";
import { NAVIGATION_ITEMS, PAGE_ROUTES } from "@/lib/constants";
import { usePathname } from "@/navigation";
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

  const filteredItems = NAVIGATION_ITEMS.filter((item) => item.isPrimary);

  const firstTwoItems = filteredItems.slice(0, 2);
  const lastTwoItems = filteredItems.slice(-2);

  return (
    <nav className="scrollbar-hide fixed bottom-0 left-0 z-50 h-16 w-full border-t border-border bg-background lg:hidden">
      <div className="scrollbar-hide flex h-full items-center justify-between overflow-auto font-medium">
        {firstTwoItems.map((page) => (
          <MobileTabsListItem key={page.link} page={page} />
        ))}
        <NavigationItemsDrawer />
        {lastTwoItems.map((page) => (
          <MobileTabsListItem key={page.link} page={page} />
        ))}
      </div>
    </nav>
  );
};
export default MobileTabsList;
