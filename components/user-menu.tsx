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
import ModeToggle from "@/components/ui/mode-toggle";
import { useTranslations } from "next-intl";
import LocaleToggle from "@/components/ui/locale-toggle";

const UserMenu = () => {
  const t = useTranslations("Components.UserMenu");
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
      <DropdownMenuTrigger className="select-none outline-none focus:outline-none">
        <Avatar>
          <AvatarImage alt={user?.name} />
          <AvatarFallback>{avatarPlaceholder}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="grid w-[300px] grid-cols-1 gap-[12px] p-4"
        align="end"
      >
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">{user?.name}</p>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <hr />

        <LocaleToggle />

        <div className="block lg:hidden">
          <Label>{t("colorModeLabel")}</Label>
          <div className="flex gap-1 bg-background">
            <ModeToggle />
          </div>
        </div>

        <Button
          type="button"
          onClick={() => handleLogout()}
          disabled={isPending}
          loading={isPending}
        >
          {t("logoutLabel")}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
