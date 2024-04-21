"use client";
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
import { Button } from "@/components/ui/button";
import { FaBars, FaChevronRight } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import Link from "next/link";

const NavigationItemsDrawer = () => {
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
          className="rounded-full w-[44px] h-[44px]"
          type="button"
          name="navigation-drawer"
          aria-label="Open navigation menus"
        >
          <FaBars className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[70vh]">
        <div className="w-full">
          <DrawerHeader>
            <DrawerTitle className="text-primary">Navigation Menus</DrawerTitle>
            <DrawerDescription>
              Search for a menu by using the search bar below.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="grid gap-1">
              <Label>Search</Label>
              <Input
                id="search"
                placeholder="Search for a menu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 border rounded-md p-2 mt-4">
              {filteredNavItems.length === 0 && (
                <div className="flex flex-col justify-center items-center w-full h-full">
                  <p>No menu was found for your search...</p>
                  <Button
                    variant="outline"
                    className="mt-1"
                    onClick={() => setQuery("")}
                  >
                    Clear search
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
                    className="w-full font-medium text-base text-left flex items-center gap-2 text-foreground"
                  >
                    <item.icon size={18} />
                    {item.label}
                    <FaChevronRight className="ml-auto text-muted-foreground" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NavigationItemsDrawer;
