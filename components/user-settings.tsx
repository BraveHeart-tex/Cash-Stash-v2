"use client";

import { Button } from "@/components/ui/button";
import { enableTwoFactorAuthentication } from "@/server/auth";
import useAuthStore from "@/store/auth/authStore";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { useTransition } from "react";
import { MdPhonelinkSetup } from "react-icons/md";

const UserSettings = () => {
  const setUri = useAuthStore((state) => state.setUri);
  const [isPending, startTransition] = useTransition();
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm,
  );
  const handleEnableTwoFactorAuth = () => {
    showGenericConfirm({
      title: "Are you sure you want to enable 2FA?",
      message:
        "Enabling 2FA will add an extra layer of security to your account. Are you sure you want to enable it?",
      primaryActionLabel: "Enable",
      onConfirm: () => {
        startTransition(async () => {
          const uriResponse = await enableTwoFactorAuthentication();
          setUri(uriResponse);
        });
      },
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">
          2-Factor Authentication
        </h2>
        <p className="text-sm text-muted-foreground">
          You can Enable 2FA to add an extra layer of security to your account.
        </p>
        <Button
          className="mt-2 w-max"
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
