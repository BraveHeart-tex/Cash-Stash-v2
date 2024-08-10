"use client";
import AutoProgressInput from "@/components/auto-progress-input";
import Logo from "@/components/logo";
import TwoFactorAuthenticationTimer from "@/components/two-factor-authentication-timer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PAGE_ROUTES } from "@/lib/constants";
import { useRouter } from "@/navigation";
import { validateOTP } from "@/server/auth";
import { useLocale } from "next-intl";
import { redirect as nextRedirect } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type TwoFactorAuthenticationFormProps = {
  email: string;
  internationalizationConfig: {
    twoFactorFormTitle: string;
    twoFactorFormDescription: string;
    twoFactorFormCodeLabel: string;
    twoFactorFormButtonLabel: string;
  };
};

const TwoFactorAuthenticationForm = ({
  email,
  internationalizationConfig,
}: TwoFactorAuthenticationFormProps) => {
  const {
    twoFactorFormCodeLabel,
    twoFactorFormDescription,
    twoFactorFormTitle,
    twoFactorFormButtonLabel,
  } = internationalizationConfig;
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const handleOTPValidation = () => {
    startTransition(async () => {
      const response = await validateOTP(code, email);

      if (response.error) {
        toast.error(response.error);
        if (response.redirectPath) {
          nextRedirect(`/${locale}/${response.redirectPath}`);
        }
      }

      if (response.successMessage) {
        router.push(PAGE_ROUTES.HOME_PAGE);
        toast.success(response.successMessage);
      }
    });
  };

  return (
    <Card>
      <CardHeader className="text-xl">
        <Logo width={200} height={200} className="mx-auto mb-4" />
        <CardTitle>{twoFactorFormTitle}</CardTitle>
        <CardDescription>{twoFactorFormDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <TwoFactorAuthenticationTimer />
        <div className="mt-4 flex w-full items-center justify-center">
          <div>
            <Label>{twoFactorFormCodeLabel}</Label>
            <AutoProgressInput
              loading={isPending}
              length={6}
              onChange={setCode}
            />
          </div>
          <Button
            type="button"
            name="two-factor-authentication"
            className="self-end"
            onClick={() => handleOTPValidation()}
            disabled={isPending || code.length < 6}
            loading={isPending}
          >
            {twoFactorFormButtonLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuthenticationForm;
