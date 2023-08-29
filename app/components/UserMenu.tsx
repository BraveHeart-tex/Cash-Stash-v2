"use client";
import {
  Menu,
  MenuButton,
  Button,
  Avatar,
  MenuList,
  Center,
  MenuDivider,
  MenuItem,
  useColorMode,
} from "@chakra-ui/react";
// import { signOut } from 'next-auth/react';
import { useAppSelector } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../redux/features/userSlice";
import { useEffect } from "react";
import { AppDispatch } from "../redux/store";
import { logoutAction } from "@/actions";

const UserMenu = () => {
  const user = useAppSelector((state) => state.userReducer.currentUser);
  const dispatch = useDispatch<AppDispatch>();

  const { colorMode } = useColorMode();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={"full"}
        variant={"link"}
        cursor={"pointer"}
        minW={0}
        bg={"transparent"}
      >
        <Avatar
          src={user?.image as string}
          name={user?.name as string}
          bg={colorMode === "light" ? "gray.200" : "gray.700"}
          color={colorMode === "light" ? "gray.600" : "gray.200"}
        />
      </MenuButton>
      <MenuList alignItems={"center"}>
        <br />
        <Center>
          <Avatar
            src={user?.image as string}
            name={user?.name as string}
            bg={colorMode === "light" ? "gray.200" : "gray.700"}
            color={colorMode === "light" ? "gray.600" : "gray.200"}
            size={"xl"}
          />
        </Center>
        <br />
        <Center>
          <p>{user?.name}</p>
        </Center>
        <br />
        <MenuDivider />
        <form action={logoutAction}>
          <MenuItem type="submit">Logout</MenuItem>
        </form>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
