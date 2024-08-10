"use client";
import Logo from "@/components/logo";
import ModeToggle from "@/components/ui/mode-toggle";
import UserMenu from "@/components/user-menu";
import { PAGE_ROUTES } from "@/lib/constants";
import { Link } from "@/navigation";
import useAuthStore from "@/store/auth/authStore";
import type { User } from "lucia";
import { useEffect } from "react";

type NavbarProps = {
  user: User | null;
};

const Navbar = ({ user }: NavbarProps) => {
  const setCurrentUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setCurrentUser(user);
  }, [user, setCurrentUser]);

  return (
    <div className="mb-6 bg-primary p-4 shadow-sm dark:border-b dark:bg-background">
      <div className="flex items-center justify-between">
        <div className="hidden md:block" />
        <Link href={PAGE_ROUTES.HOME_PAGE} className="ml-auto lg:ml-0">
          <Logo
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
    </div>
  );
};

export default Navbar;
