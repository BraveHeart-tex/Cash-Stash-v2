"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useRef } from "react";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { Button } from "@/components/ui/button";

const GenericConfirmDialog2 = () => {
  const {
    visible,
    cleanUp,
    title,
    message,
    primaryActionLabel,
    secondaryActionLabel,
    callPrimaryAction,
    callSecondaryAction,
    loading,
  } = useGenericConfirmStore((state) => state);
  const actionRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (visible && actionRef?.current) {
      actionRef?.current?.focus();
    }
  }, [visible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (visible && event.key === "Enter" && actionRef.current) {
        actionRef.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  return (
    <AlertDialog open={visible}>
      <AlertDialogContent onEscapeKeyDown={cleanUp}>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>{title} </AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex items-center gap-1 flex-row">
            <Button
              disabled={loading}
              variant="outline"
              onClick={() => {
                callSecondaryAction();
                cleanUp();
              }}
            >
              {secondaryActionLabel ?? "Cancel"}
            </Button>
            {primaryActionLabel && (
              <Button
                onClick={() => {
                  callPrimaryAction();
                }}
                disabled={loading}
                tabIndex={0}
                ref={actionRef}
              >
                {primaryActionLabel}
              </Button>
            )}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GenericConfirmDialog2;
