"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaBars, FaChevronRight } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const NavigationItemsDrawer = () => {
  const t = useTranslations("NavigationItems");
  const drawerT = useTranslations("NavigationItemsDrawer");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredNavItems = NAVIGATION_ITEMS.filter((item) => {
    return (
      !item.isPrimary && item.label.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setQuery("");
        setOpen(isOpen);
      }}
    >
      <DrawerTrigger asChild>
        <Button
          className="h-[44px] w-[44px] rounded-full"
          type="button"
          name="navigation-drawer"
          aria-label={drawerT("trigger-aria-label")}
        >
          <FaBars className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[70vh]">
        <div className="w-full">
          <DrawerHeader>
            <DrawerTitle className="text-primary">
              {drawerT("title")}
            </DrawerTitle>
            <DrawerDescription>{drawerT("description")}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="grid gap-1">
              <Label htmlFor="search-navigation-menus-input">
                {drawerT("searchLabel")}
              </Label>
              <div className="relative">
                <Input
                  id="search-navigation-menus-input"
                  name="search-navigation-menus-input"
                  type="text"
                  placeholder={drawerT("searchPlaceholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-8"
                />
                {query && (
                  <Button
                    type="button"
                    name="clear-search"
                    aria-label={drawerT("clearSearchButtonLabel")}
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-0 text-muted-foreground"
                    onClick={() => setQuery("")}
                  >
                    <span className="sr-only">
                      {drawerT("clearSearchButtonLabel")}
                    </span>
                    <FaXmark />
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-4 flex h-[calc(100vh-530px)] max-h-[calc(100vh-530px)] flex-col gap-1 overflow-auto rounded-md border p-2">
              {filteredNavItems.length === 0 && (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    {drawerT("noMenusFoundMessage")}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-1"
                    onClick={() => setQuery("")}
                  >
                    {drawerT("clearSearchButtonLabel")}
                  </Button>
                </div>
              )}
              {filteredNavItems.map((item) => (
                <Button
                  key={item.link}
                  className="w-full"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  <Link
                    href={item.link}
                    className="flex w-full items-center gap-2 text-left text-base font-medium text-foreground"
                  >
                    <item.icon size={18} />
                    {/* biome-ignore lint/suspicious/noExplicitAny: Intentional*/}
                    {t(`${item.link}.label` as any)}
                    <FaChevronRight className="ml-auto text-muted-foreground" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{drawerT("closeDrawerLabel")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NavigationItemsDrawer;
