"use client";
import { useTransition } from "react";
import { logout } from "@/data/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/auth/authStore";
import { ModeToggle } from "@/components/mode-toggle";
import { Label } from "@/components/ui/label";

const UserMenu = () => {
  let [isPending, startTransition] = useTransition();
  const user = useAuthStore((state) => state.user);

  const avatarPlaceholder = user?.name ? user.name[0] : "";

  const handleLogout = () => {
    startTransition(async () => {
      logout();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus:outline-none">
        <Avatar>
          <AvatarImage alt={user?.name} />
          <AvatarFallback>{avatarPlaceholder}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="p-4 grid grid-cols-1 gap-[12px] w-[300px]"
        align="end"
      >
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">{user?.name}</p>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <hr />

        <div className="block lg:hidden">
          <Label>Color Mode</Label>
          <ModeToggle layoutId="active-colorTheme-pill-userMenu" />
        </div>

        <Button
          type="button"
          onClick={() => handleLogout()}
          disabled={isPending}
        >
          Logout
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
