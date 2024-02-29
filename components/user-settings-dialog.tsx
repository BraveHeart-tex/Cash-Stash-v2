"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "./ui/button";
import { FaCog } from "react-icons/all";
import UserSettings from "@/components/user-settings";
const UserSettingsDialog = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const title = "Customize your settings";
  const description =
    "Make changes to your preferences here. Click save when you're done.";

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="w-full">
          <Button
            variant="ghost"
            className="flex items-center gap-2 justify-start w-full"
          >
            <FaCog />
            Settings
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <UserSettings />
          </div>
          <DrawerFooter className="pt-2 mt-2">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button
          variant="ghost"
          className="justify-start flex items-center gap-2 w-full"
        >
          <FaCog />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <UserSettings />
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsDialog;
