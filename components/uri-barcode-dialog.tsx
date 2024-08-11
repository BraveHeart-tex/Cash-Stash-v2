"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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
import useAuthStore from "@/store/auth/authStore";
import { FaCopy } from "react-icons/fa";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

const UriBarcodeDialog = () => {
  const uri = useAuthStore((state) => state.uri);
  const setUri = useAuthStore((state) => state.setUri);
  const regex = /[?&]secret=([^&]+)/;
  const secretMatch = regex.exec(uri);
  const secret = secretMatch ? secretMatch[1] : null;
  const isMobile = useMediaQuery("(max-width: 768px)");

  const open = !!uri;
  const title = "Scan the QR code with your authenticator app";
  const description =
    "Use the following QR code to enable Two-Factor authentication on your authenticator app. You can also manually enter the following code:";

  const onClose = () => {
    setUri("");
  };

  const handleCopyToClipBoard = async () => {
    await navigator.clipboard.writeText(secret);
    toast.info("Code copied to clipboard.");
  };

  const renderContent = () => {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {secret && (
          <div className="flex items-center gap-2">
            <Button size="icon" onClick={handleCopyToClipBoard}>
              <FaCopy />
            </Button>
            <span className="rounded-md border border-primary p-2 text-primary">
              {secret}
            </span>
          </div>
        )}
        <QRCode value={uri} />
      </div>
    );
  };

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onClose();
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{renderContent()}</div>
          <DrawerFooter className="pt-2">
            <Button
              onClick={() => {
                onClose();
              }}
            >
              I've scanned the QR code / entered the code
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {renderContent()}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            I've scanned the QR code / entered the code
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UriBarcodeDialog;
