"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HamburgerIcon } from "@chakra-ui/icons";
import Logo from "./Logo.svg";
import Image from "next/image";
import UserMenu from "./UserMenu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import { ModeSwitch } from "@/components/ModeSwitch";
import { useState } from "react";

const NAV_LINKS = [
  { name: "Dashboard", href: "/" },
  { name: "Accounts", href: "/accounts" },
  { name: "Budgets", href: "/budgets" },
  { name: "Goals", href: "/goals" },
  { name: "Transactions", href: "/transactions" },
  { name: "Reports", href: "/reports" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <div className="mb-6 shadow-lg rounded-md p-4">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Menu"
          onClick={onOpen}
          className="block lg:hidden"
        >
          <HamburgerIcon />
        </Button>
        <Link href={"/"}>
          <Image
            src={Logo}
            alt="Cash Stash"
            width={185}
            className="dark:brightness-0 md:mx-auto"
          />
        </Link>
        <div className="hidden lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:underline mr-4"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex justify-center items-center gap-4">
          <div className="lg:flex items-center hidden gap-1">
            <ModeToggle showOutline={false} />
            <UserMenu />
          </div>
        </div>
      </div>

      <Sheet
        open={isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onClose();
          }
        }}
      >
        <SheetContent side="left" className="w-[300px] md:[540px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <ModeSwitch />
            {NAV_LINKS.map((link) => (
              <Link key={link.name} href={link.href}>
                {link.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navigation;
