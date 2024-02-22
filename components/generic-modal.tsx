"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { closeGenericModal } from "@/redux/features/genericModalSlice";
import { getGenericDialogContent } from "@/lib/getGenericModalContent";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const GenericModal = () => {
  const dispatch = useAppDispatch();
  const {
    entityId,
    dialogTitle,
    dialogDescription,
    isGenericModalOpen,
    mode,
    key,
    data,
    props,
  } = useAppSelector((state) => state.genericModalReducer);
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!key) {
    return null;
  }

  const dialogContentToBeRendered = getGenericDialogContent({
    mode,
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
            dispatch(closeGenericModal());
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{dialogTitle}</DrawerTitle>
            <DrawerDescription>{dialogDescription}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{dialogContentToBeRendered}</div>
          <DrawerFooter className="pt-2">
            <Button
              variant="ghost"
              onClick={() => dispatch(closeGenericModal())}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={isGenericModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          dispatch(closeGenericModal());
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            <p>{dialogDescription}</p>
          </DialogDescription>
        </DialogHeader>
        {dialogContentToBeRendered}
        <DialogFooter>
          <Button variant="ghost" onClick={() => dispatch(closeGenericModal())}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default GenericModal;
