"use client";
import TwoFactorAuthenticationActivation from "@/components/settings/two-factor-authentication-activation";
import { Button } from "@/components/ui/button";
import {
  disableTwoFactorAuthentication,
  enableTwoFactorAuthentication,
} from "@/server/auth";
import useAuthStore from "@/store/auth/authStore";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { useTransition } from "react";
import { MdOutlineScreenLockPortrait } from "react-icons/md";
import { toast } from "sonner";

type TwoFactorAuthenticationSettingsProps = {
  internationalizationConfig: {
    twoFactorSettingsTitle: string;
    twoFactorAlreadyEnableDescription: string;
    twoFactorSettingsDescription: string;
    twoFactorDisableDialogTitle: string;
    twoFactorDisableDialogMessage: string;
    twoFactorDisableDialogPrimaryActionLabel: string;
    twoFactorEnableDialogTitle: string;
    twoFactorEnableDialogMessage: string;
    twoFactorToastInfoMessage: string;
    twoFactorEnableDialogPrimaryActionLabel: string;
    twoFactorEnablePending: string;
    twoFactorEnableCTA: string;
    twoFactorDisablePeding: string;
    twoFactorDisableCTA: string;

    twoFactorFormStepOne: string;
    twoFactorFormStepTwo: string;
    twoFactorFormStepThree: string;
    twoFactorCopyToClipboardSuccessMessage: string;
    twoFactorCopyToClipboardCTA: string;
    twoFactorCodeInputLabel: string;
  };
};

const TwoFactorAuthenticationSettings = ({
  internationalizationConfig,
}: TwoFactorAuthenticationSettingsProps) => {
  const user = useAuthStore((state) => state.user);
  const setUri = useAuthStore((state) => state.setUri);
  const setUser = useAuthStore((state) => state.setUser);
  const showConfirm = useGenericConfirmStore((state) => state.showConfirm);
  const [isPending, startTransition] = useTransition();

  const {
    twoFactorSettingsTitle,
    twoFactorAlreadyEnableDescription,
    twoFactorSettingsDescription,
    twoFactorDisableDialogTitle,
    twoFactorDisableDialogMessage,
    twoFactorDisableDialogPrimaryActionLabel,
    twoFactorEnableDialogTitle,
    twoFactorEnableDialogMessage,
    twoFactorToastInfoMessage,
    twoFactorEnableDialogPrimaryActionLabel,
    twoFactorEnablePending,
    twoFactorEnableCTA,
    twoFactorDisablePeding,
    twoFactorDisableCTA,
  } = internationalizationConfig;

  const handleDisabledTwoFactorAuth = () => {
    showConfirm({
      title: twoFactorDisableDialogTitle,
      message: twoFactorDisableDialogMessage,
      primaryActionLabel: twoFactorDisableDialogPrimaryActionLabel,
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
      title: twoFactorEnableDialogTitle,
      message: twoFactorEnableDialogMessage,
      primaryActionLabel: twoFactorEnableDialogPrimaryActionLabel,
      onConfirm: () => {
        startTransition(async () => {
          const uriResponse = await enableTwoFactorAuthentication();
          setUri(uriResponse);
          setUser({ prefersTwoFactorAuthentication: true });
          toast.info(twoFactorToastInfoMessage);
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
    <section id="two-factor-authentication">
      <h2 className="text-xl font-semibold text-primary">
        {twoFactorSettingsTitle}
      </h2>
      <p className="w-full text-muted-foreground lg:w-[70%]">
        {user?.prefersTwoFactorAuthentication &&
        user.activatedTwoFactorAuthentication
          ? twoFactorAlreadyEnableDescription
          : twoFactorSettingsDescription}
      </p>
      {shouldShowActiviationForm ? (
        <TwoFactorAuthenticationActivation
          internationalizationConfig={internationalizationConfig}
        />
      ) : null}
      {shouldShowEnableButton ? (
        <Button
          className="mt-2 flex w-max items-center gap-2"
          onClick={handleEnableTwoFactorAuth}
          disabled={isPending}
        >
          <MdOutlineScreenLockPortrait />
          {isPending ? twoFactorEnablePending : twoFactorEnableCTA}
        </Button>
      ) : null}

      {shouldShowDisableButton ? (
        <Button
          className="mt-2 flex w-max items-center gap-2"
          onClick={handleDisabledTwoFactorAuth}
          disabled={isPending}
        >
          <MdOutlineScreenLockPortrait />
          {isPending ? twoFactorDisablePeding : twoFactorDisableCTA}
        </Button>
      ) : null}
    </section>
  );
};

export default TwoFactorAuthenticationSettings;
