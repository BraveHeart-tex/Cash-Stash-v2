"use client";

import { Button } from "@/components/ui/button";
import { MdPhonelinkSetup } from "react-icons/md";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { useTransition } from "react";
import { enableTwoFactorAuthentication } from "@/data/auth";

const UserSettings = () => {
  const [isPending, startTransition] = useTransition();
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm
  );
  const handleEnableTwoFactorAuth = () => {
    showGenericConfirm({
      title: "Enable 2FA",
      message: "Are you sure you want to enable 2FA?",
      primaryActionLabel: "Enable",
      onConfirm: () => {
        startTransition(async () => {
          const uri = await enableTwoFactorAuthentication();
          console.log("uri", uri);
        });
      },
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-foreground text-lg">
          2-Factor Authentication
        </h2>
        <p className="text-muted-foreground text-sm">
          You can Enable 2FA to add an extra layer of security to your account.
        </p>
        <Button
          className="w-max mt-2"
          onClick={handleEnableTwoFactorAuth}
          disabled={isPending}
        >
          <MdPhonelinkSetup className="mr-2" />
          Enable 2FA
        </Button>
      </div>
    </div>
  );
};

export default UserSettings;
