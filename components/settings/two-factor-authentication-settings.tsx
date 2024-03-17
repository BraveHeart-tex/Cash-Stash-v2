"use client";
import {
  disableTwoFactorAuthentication,
  enableTwoFactorAuthentication,
} from "@/actions/auth";
import useAuthStore from "@/store/auth/authStore";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { MdOutlineScreenLockPortrait } from "react-icons/md";

const TwoFactorAuthenticationSettings = () => {
  const user = useAuthStore((state) => state.user);
  const setUri = useAuthStore((state) => state.setUri);
  const setUser = useAuthStore((state) => state.setUser);
  const showConfirm = useGenericConfirmStore((state) => state.showConfirm);
  let [isPending, startTransition] = useTransition();

  const handleDisabledTwoFactorAuth = () => {
    showConfirm({
      title: "Disable Two-Factor Authentication",
      message: "Are you sure you want to disable two-factor authentication?",
      primaryActionLabel: "Disable",
      onConfirm: () => {
        startTransition(async () => {
          const response = await disableTwoFactorAuthentication();
          if (response.successMessage) {
            setUser({ ...user!, prefersTwoFactorAuthentication: false });
            toast.success(response.successMessage);
          }

          if (response.error) {
            toast.error(response.error);
          }
        });
      },
    });
  };

  const handleEnableTwoFactorAuth = () => {
    showConfirm({
      title: "Enable Two-Factor Authentication",
      message: "Are you sure you want to enable two-factor authentication?",
      primaryActionLabel: "Enable",
      onConfirm: () => {
        startTransition(async () => {
          const uriResponse = await enableTwoFactorAuthentication();
          setUri(uriResponse);
          setUser({ ...user!, prefersTwoFactorAuthentication: true });
        });
      },
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary">
        Two-Factor Authentication
      </h2>
      <p className="text-muted-foreground w-full lg:w-[70%]">
        {user?.prefersTwoFactorAuthentication ? (
          "Two-factor authentication is currently enabled on your account."
        ) : (
          <>
            Add an extra layer of security to your account by enabling
            two-factor authentication. <br />
            When enabled, you will be required to enter a unique code from your
            mobile device in addition to your password when signing in.
          </>
        )}
      </p>
      {user?.prefersTwoFactorAuthentication ? (
        <Button
          className="w-max text-md flex items-center gap-2 mt-2"
          onClick={handleDisabledTwoFactorAuth}
          disabled={isPending}
        >
          <MdOutlineScreenLockPortrait />
          {isPending ? "Disabling..." : "Disable Two-Factor Authentication"}
        </Button>
      ) : (
        <Button
          className="w-max text-md flex items-center gap-2 mt-2"
          onClick={handleEnableTwoFactorAuth}
          disabled={isPending}
        >
          <MdOutlineScreenLockPortrait />
          {isPending ? "Enabling..." : "Enable Two-Factor Authentication"}
        </Button>
      )}
    </div>
  );
};

export default TwoFactorAuthenticationSettings;
