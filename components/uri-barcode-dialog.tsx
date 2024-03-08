"use client";
import useAuthStore from "@/store/auth/authStore";
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
import QRCode from "react-qr-code";
import { FaCopy } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UriBarcodeDialog = () => {
  const uri = useAuthStore((state) => state.uri);
  const setUri = useAuthStore((state) => state.setUri);
  const regex = /[?&]secret=([^&]+)/;
  const secretMatch = regex.exec(uri);
  const secret = secretMatch ? secretMatch[1] : null;

  const open = !!uri;
  const onClose = () => {
    setUri("");
  };

  const handleCopyToClipBoard = async () => {
    await navigator.clipboard.writeText(secret!);
    toast.info("Code copied to clipboard.");
  };

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
        <AlertDialogHeader>
          <AlertDialogTitle>
            Scan the QR code with your authenticator app
          </AlertDialogTitle>
          <AlertDialogDescription>
            Use the following QR code to enable Two-Factor authentication on
            your authenticator app. You can also manually enter the following
            code:
          </AlertDialogDescription>
        </AlertDialogHeader>
        {uri && (
          <div className="w-full flex items-center justify-center flex-col gap-4">
            {secret && (
              <div className="flex items-center gap-2">
                <Button size="icon" onClick={handleCopyToClipBoard}>
                  <FaCopy />
                </Button>
                <span
                  className={
                    "border border-primary rounded-md p-2 text-primary"
                  }
                >
                  {secret}
                </span>
              </div>
            )}
            <QRCode value={uri} />
          </div>
        )}
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
