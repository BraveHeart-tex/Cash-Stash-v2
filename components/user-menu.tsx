"use client";
import { useState, useTransition } from "react";
import { logout } from "@/server/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/auth/authStore";
import { Label } from "@/components/ui/label";
import ModeToggle from "./ui/mode-toggle";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  let [isPending, startTransition] = useTransition();
  const user = useAuthStore((state) => state.user);

  const avatarPlaceholder = user?.name ? user.name[0] : "";

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
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
          <div className="bg-background flex gap-1">
            <ModeToggle />
          </div>
        </div>

        <Button
          type="button"
          onClick={() => handleLogout()}
          disabled={isPending}
        >
          {isPending ? "Logging out..." : "Logout"}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
