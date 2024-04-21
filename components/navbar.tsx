"use client";
import Image from "next/image";
import UserMenu from "@/components/user-menu";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "lucia";
import useAuthStore from "@/store/auth/authStore";
import { PAGE_ROUTES } from "@/lib/constants";
import ModeToggle from "@/components/ui/mode-toggle";

const Navbar = ({ user }: { user: User | null }) => {
  const setCurrentUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setCurrentUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="mb-6 bg-primary p-4 shadow-sm dark:border-b dark:bg-background">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, type: "just" }}
      >
        <div className="flex items-center justify-between">
          <div className="hidden md:block" />
          <Link href={PAGE_ROUTES.HOME_PAGE} className="ml-auto lg:ml-0">
            <Image
              src={"/logo.svg"}
              alt="Cash Stash"
              width={200}
              height={200}
              className="mx-auto grayscale invert monokai-dark:invert-0 lg:mx-0"
            />
          </Link>
          <div className="ml-auto flex items-center justify-center gap-4 lg:ml-0">
            <div className="hidden items-center gap-1 rounded-md bg-background lg:flex">
              <ModeToggle />
            </div>
            <UserMenu />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
