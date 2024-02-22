"use client";
import { callPrimaryAction } from "@/redux/features/genericConfirmSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cleanUp } from "@/redux/features/genericConfirmSlice";
import { useTransition } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const GenericConfirmDialog = () => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const { visible, title, message, primaryActionLabel } = useAppSelector(
    (state) => state.genericConfirmReducer
  );
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <Drawer
        open={visible}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            dispatch(cleanUp());
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{message}</div>
          <DrawerFooter className="pt-2">
            {primaryActionLabel && (
              <Button
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    dispatch(callPrimaryAction());
                  });
                }}
              >
                {primaryActionLabel}
              </Button>
            )}
            <Button
              disabled={isPending}
              variant="ghost"
              onClick={() => dispatch(cleanUp())}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={visible}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title} </AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            onClick={() => dispatch(cleanUp())}
          >
            Cancel
          </AlertDialogCancel>
          {primaryActionLabel && (
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  dispatch(callPrimaryAction());
                });
              }}
            >
              {primaryActionLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default GenericConfirmDialog;
