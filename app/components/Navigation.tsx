"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Logo from "./Logo.svg";
import Image from "next/image";
import UserMenu from "./UserMenu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import { ModeSwitch } from "@/components/ModeSwitch";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks";

const NAV_LINKS = [
  { name: "Dashboard", href: "/" },
  { name: "Accounts", href: "/accounts" },
  { name: "Budgets", href: "/budgets" },
  { name: "Goals", href: "/goals" },
  { name: "Transactions", href: "/transactions" },
  { name: "Reports", href: "/reports" },
];

const Navigation = () => {
  const currentUser = useAppSelector((state) => state.userReducer.currentUser);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <div className="mb-6 shadow-lg p-4 bg-primary dark:bg-background dark:border-b">
      <div className="flex justify-between items-center">
        <div className="hidden md:block" />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Menu"
          onClick={onOpen}
          className="lg:hidden flex items-center justify-center text-white hover:bg-secondary"
        >
          <HamburgerMenuIcon />
        </Button>
        <Link href={"/"}>
          <Image
            src={Logo}
            alt="Cash Stash"
            width={200}
            className="md:mx-auto"
            style={{
              filter: "grayscale(1) invert(1)",
            }}
          />
        </Link>
        <div className="flex justify-center items-center gap-4">
          <div className="lg:flex items-center hidden gap-1">
            <ModeToggle />
          </div>
          <UserMenu />
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
          <div className="flex flex-col justify-between items h-[100%]">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-lg">
                {" "}
                Welcome! {currentUser?.name}
              </span>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:underline"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <ModeSwitch />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navigation;
