"use client";
import { useAppSelector } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../redux/features/userSlice";
import { useEffect } from "react";
import { AppDispatch } from "../redux/store";
import { logoutAction } from "@/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const UserMenu = () => {
  const user = useAppSelector((state) => state.userReducer.currentUser);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const avatarPlaceholder = user?.name ? user.name[0] : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus:outline-none">
        <Avatar>
          <AvatarImage src={user?.image as string} alt={user?.name} />
          <AvatarFallback>{avatarPlaceholder}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="p-4 grid grid-cols-1 gap-4 w-[300px]"
        align="end"
      >
        <p className="text-lg font-bold">{user?.name}</p>
        <hr />
        <p className="text-accent-foreground">{user?.email}</p>

        <form action={logoutAction}>
          <Button type="submit">Logout</Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
