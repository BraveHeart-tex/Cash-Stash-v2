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

const UriBarcodeDialog = () => {
  const uri = useAuthStore((state) => state.uri);
  const setUri = useAuthStore((state) => state.setUri);

  const open = !!uri;
  const onClose = () => {
    setUri("");
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
            Use the following QR code to enable 2FA on your authenticator app.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {uri && (
          <div className="w-full flex items-center justify-center">
            <QRCode value={uri} />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>I've scanned the QR code</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UriBarcodeDialog;
