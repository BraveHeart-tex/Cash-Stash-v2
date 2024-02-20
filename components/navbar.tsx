"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Logo from "./Logo.svg";
import Image from "next/image";
import UserMenu from "./user-menu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { useState } from "react";
import { useAppSelector } from "../app/redux/hooks";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { name: "Dashboard", href: "/" },
  { name: "Accounts", href: "/accounts" },
  { name: "Budgets", href: "/budgets" },
  { name: "Goals", href: "/goals" },
  { name: "Transactions", href: "/transactions" },
  { name: "Reports", href: "/reports" },
];

const Navbar = () => {
  const pathname = usePathname();
  const currentUser = useAppSelector((state) => state.userReducer.currentUser);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  if (pathname.startsWith("/login") || pathname.startsWith("/signup"))
    return null;

  return (
    <div className="mb-6 shadow-lg p-4 bg-primary dark:bg-background dark:border-b">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, type: "just" }}
      >
        <div className="flex justify-between items-center">
          <div className="hidden md:block" />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            onClick={onOpen}
            className="lg:hidden justify-center mr-auto flex items-center text-white hover:bg-secondary"
          >
            <HamburgerMenuIcon />
          </Button>

          <Link href={"/"}>
            <Image
              src={Logo}
              alt="Cash Stash"
              width={200}
              className="mx-auto lg:mx-0"
              style={{
                filter: "grayscale(1) invert(1)",
              }}
            />
          </Link>
          <div className="flex justify-center items-center gap-4 ml-auto lg:ml-0">
            <div className="lg:flex items-center hidden gap-1">
              <ModeToggle />
            </div>
            <UserMenu />
          </div>
        </div>
      </motion.div>

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
            <div>
              <Label>Change Color Mode</Label>
              <ModeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navbar;
