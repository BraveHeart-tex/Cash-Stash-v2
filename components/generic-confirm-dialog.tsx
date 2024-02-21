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

const GenericConfirmDialog = () => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const { visible, title, message, primaryActionLabel } = useAppSelector(
    (state) => state.genericConfirmReducer
  );

  return (
    <AlertDialog open={visible}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title} </AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => dispatch(cleanUp())}>
            Kapat
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
