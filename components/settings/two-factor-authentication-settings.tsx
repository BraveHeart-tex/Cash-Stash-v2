"use client";
import {
  disableTwoFactorAuthentication,
  enableTwoFactorAuthentication,
} from "@/actions/auth";
import useAuthStore from "@/store/auth/authStore";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MdOutlineScreenLockPortrait } from "react-icons/md";
import TwoFactorAuthenticationActivation from "./two-factor-authentication-activation";

const TwoFactorAuthenticationSettings = () => {
  const user = useAuthStore((state) => state.user);
  const setUri = useAuthStore((state) => state.setUri);
  const setUser = useAuthStore((state) => state.setUser);
  const showConfirm = useGenericConfirmStore((state) => state.showConfirm);
  let [isPending, startTransition] = useTransition();

  const handleDisabledTwoFactorAuth = () => {
    showConfirm({
      title: "Are you sure you want to disable two-factor authentication?",
      message:
        "Two-factor authentication increases the security of your account. Are you sure you want to disable it? You can enable it again at any time.",
      primaryActionLabel: "Disable",
      onConfirm: () => {
        startTransition(async () => {
          const response = await disableTwoFactorAuthentication();
          if (response.successMessage) {
            setUser({
              prefersTwoFactorAuthentication: false,
              activatedTwoFactorAuthentication: false,
            });
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
      title: "Are you sure you want to enable two-factor authentication?",
      message:
        "Upon enabling two-factor authentication, you will be required to enter a unique code from your mobile device in addition to your password when signing in.",
      primaryActionLabel: "Enable",
      onConfirm: () => {
        startTransition(async () => {
          const uriResponse = await enableTwoFactorAuthentication();
          setUri(uriResponse);
          setUser({ prefersTwoFactorAuthentication: true });
        });
      },
    });
  };

  const shouldShowActiviationForm =
    !user?.activatedTwoFactorAuthentication &&
    user?.prefersTwoFactorAuthentication;

  const shouldShowEnableButton =
    !user?.prefersTwoFactorAuthentication &&
    !user?.activatedTwoFactorAuthentication;

  const shouldShowDisableButton =
    user?.prefersTwoFactorAuthentication &&
    user?.activatedTwoFactorAuthentication;

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary">
        Two-Factor Authentication
      </h2>
      <p className="text-muted-foreground w-full lg:w-[70%]">
        {user?.prefersTwoFactorAuthentication &&
        user.activatedTwoFactorAuthentication ? (
          "Two-factor authentication is currently enabled on your account."
        ) : (
          <>
            Enhance your account security with two-factor authentication. <br />
            Once enabled, simply enter a unique code from your mobile device
            along with your password during sign-in for added protection.
          </>
        )}
      </p>
      {shouldShowActiviationForm ? <TwoFactorAuthenticationActivation /> : null}
      {shouldShowEnableButton ? (
        <Button
          className="w-max flex items-center gap-2 mt-2"
          onClick={handleEnableTwoFactorAuth}
          disabled={isPending}
        >
          <MdOutlineScreenLockPortrait />
          {isPending ? "Enabling..." : "Enable Two-Factor Authentication"}
        </Button>
      ) : null}

      {shouldShowDisableButton ? (
        <Button
          className="w-max flex items-center gap-2 mt-2"
          onClick={handleDisabledTwoFactorAuth}
          disabled={isPending}
        >
          <MdOutlineScreenLockPortrait />
          {isPending ? "Disabling..." : "Disable Two-Factor Authentication"}
        </Button>
      ) : null}
    </div>
  );
};

export default TwoFactorAuthenticationSettings;
