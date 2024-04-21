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
    <div className="mb-6 shadow-sm p-4 bg-primary dark:bg-background dark:border-b">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, type: "just" }}
      >
        <div className="flex justify-between items-center">
          <div className="hidden md:block" />
          <Link href={PAGE_ROUTES.HOME_PAGE} className="ml-auto lg:ml-0">
            <Image
              src={"/logo.svg"}
              alt="Cash Stash"
              width={200}
              height={200}
              className="mx-auto lg:mx-0 invert monokai-dark:invert-0 grayscale"
            />
          </Link>
          <div className="flex justify-center items-center gap-4 ml-auto lg:ml-0">
            <div className="lg:flex items-center hidden gap-1 bg-background rounded-md">
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
