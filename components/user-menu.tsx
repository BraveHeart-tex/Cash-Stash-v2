"use client";
import { useAppSelector } from "../app/redux/hooks";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../app/redux/features/userSlice";
import { useEffect, useTransition } from "react";
import { AppDispatch } from "../app/redux/store";
import { logout } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const UserMenu = () => {
  let [isPending, startTransition] = useTransition();
  const user = useAppSelector((state) => state.userReducer.currentUser);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

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
        <p className="text-lg font-semibold">{user?.name}</p>
        <hr />
        <p className="text-accent-foreground">{user?.email}</p>

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
