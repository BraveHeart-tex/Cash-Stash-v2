"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuthStore from "@/store/auth/authStore";
import { toast } from "sonner";
import { FaCopy } from "react-icons/fa";
import QRCode from "react-qr-code";
import TwoFactorAuthenticationActivationInput from "@/components/settings/two-factor-authentication-activation-input";
import { useEffect, useTransition } from "react";
import { getTwoFactorAuthURI } from "@/server/auth";
import { ImSpinner2 } from "react-icons/im";

const TwoFactorAuthenticationActivation = () => {
  let [isPending, startTransition] = useTransition();
  const user = useAuthStore((state) => state.user);

  const uri = useAuthStore((state) => state.uri);
  const setUri = useAuthStore((state) => state.setUri);

  const regex = /[?&]secret=([^&]+)/;
  const secretMatch = regex.exec(uri);
  const secret = secretMatch ? secretMatch[1] : null;

  const handleCopyToClipBoard = async () => {
    await navigator.clipboard.writeText(secret!);
    toast.info("Code copied to clipboard.");
  };

  const shoudlGetUri =
    !uri &&
    user?.prefersTwoFactorAuthentication &&
    !user.activatedTwoFactorAuthentication;

  useEffect(() => {
    if (shoudlGetUri) {
      startTransition(async () => {
        const uriResponse = await getTwoFactorAuthURI();
        if (uriResponse) {
          setUri(uriResponse);
        }
      });
    }
  }, [shoudlGetUri, setUri]);

  return (
    <div className="mt-5 rounded-sm border bg-card p-4 text-foreground shadow-sm lg:p-10">
      <div className="flex flex-col gap-2">
        <div>
          <span className="font-semibold text-primary">1.</span> Get an
          authentication app by downloading it on your mobile device. Example:{" "}
          <Link
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US"
            target="_blank"
          >
            <Button className="p-0" variant="link">
              Google Authenticator
            </Button>
            ,
          </Link>{" "}
          <Link
            href="https://play.google.com/store/apps/details?id=org.fedorahosted.freeotp&hl=tr&gl=US"
            target="_blank"
          >
            <Button className="p-0" variant="link">
              FreeOTP
            </Button>
          </Link>
        </div>
        <div>
          <span className="font-semibold text-primary">2.</span> Scan the QR
          code or enter the secret key into your authentication app.
          {isPending && !uri ? (
            <div className="my-10 flex h-full w-full flex-col items-center justify-center">
              <ImSpinner2 className="animate-spin text-4xl" />
            </div>
          ) : (
            <div className="my-4 flex w-full flex-col items-center justify-center gap-4">
              <QRCode value={uri} />
              {secret && (
                <div className="flex items-center gap-1">
                  <Button
                    onClick={handleCopyToClipBoard}
                    className="flex items-center gap-2"
                  >
                    <FaCopy /> Copy Secret
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <span className="font-semibold text-primary">3.</span> Enter the
          6-digit code from the app to enable two-factor authentication.
          <div className="mt-1">
            <TwoFactorAuthenticationActivationInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthenticationActivation;
