"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getGenericDialogContent } from "@/lib/getGenericModalContent";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import useGenericModalStore from "@/store/genericModalStore";

const GenericModal = () => {
  const {
    entityId,
    dialogTitle,
    dialogDescription,
    isGenericModalOpen,
    key,
    data,
    props,
    closeGenericModal,
  } = useGenericModalStore((state) => state);
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!key) {
    return null;
  }

  const dialogContentToBeRendered = getGenericDialogContent({
    key,
    entityId,
    props,
    data,
  });

  if (isMobile) {
    return (
      <Drawer
        open={isGenericModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setTimeout(() => {
              closeGenericModal();
            });
          }
        }}
      >
        <DrawerContent
          className="h-[90vh]"
          onOpenAutoFocus={(event) => {
            if (isMobile) event.preventDefault();
          }}
        >
          <DrawerHeader className="text-left">
            <DrawerTitle>{dialogTitle}</DrawerTitle>
            <DrawerDescription>{dialogDescription}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            {dialogContentToBeRendered}
            <DrawerClose asChild>
              <Button className="mt-1 w-full" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={isGenericModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeGenericModal();
        }
      }}
    >
      <DialogContent
        onOpenAutoFocus={(event) => {
          if (isMobile || key === "transaction") event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {dialogContentToBeRendered}
        <DialogFooter>
          <Button variant="ghost" onClick={() => closeGenericModal()}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default GenericModal;
