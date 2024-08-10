"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { useEffect, useRef, useTransition } from "react";
import { useMediaQuery } from "usehooks-ts";

type GenericConfirmDialogProps = {
  internationalizationConfig: {
    defaultSecondaryActionLabel: string;
  };
};

const GenericConfirmDialog = ({
  internationalizationConfig,
}: GenericConfirmDialogProps) => {
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [, startTransition] = useTransition();

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

  if (isMobile) {
    return (
      <Drawer
        open={visible}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            cleanUp();
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{message}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            {primaryActionLabel && (
              <Button
                disabled={loading}
                loading={loading}
                onClick={() => {
                  startTransition(async () => {
                    callPrimaryAction();
                  });
                }}
              >
                {primaryActionLabel}
              </Button>
            )}
            <Button
              disabled={loading}
              variant="ghost"
              onClick={() => {
                callSecondaryAction();
                cleanUp();
              }}
            >
              {secondaryActionLabel ||
                internationalizationConfig.defaultSecondaryActionLabel}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={visible}>
      <AlertDialogContent onEscapeKeyDown={cleanUp}>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>{title} </AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex flex-row items-center gap-1">
            <Button
              disabled={loading}
              variant="outline"
              onClick={() => {
                callSecondaryAction();
                cleanUp();
              }}
            >
              {secondaryActionLabel ||
                internationalizationConfig.defaultSecondaryActionLabel}
            </Button>
            {primaryActionLabel && (
              <Button
                onClick={() => {
                  callPrimaryAction();
                }}
                disabled={loading}
                loading={loading}
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

export default GenericConfirmDialog;
