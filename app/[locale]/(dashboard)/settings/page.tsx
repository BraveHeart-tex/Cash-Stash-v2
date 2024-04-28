import ColorThemeSettings from "@/components/settings/color-theme-settings";
import NotificationSettings from "@/components/settings/notification-settings";
import PreferredCurrencySettings from "@/components/settings/preferred-currency-settings";
import TwoFactorAuthenticationSettings from "@/components/settings/two-factor-authentication-settings";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { redirect } from "@/navigation";
import { getTranslations } from "next-intl/server";

const SettingsPage = async () => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const t = await getTranslations("Settings");

  return (
    <section
      id="settings"
      className="mx-auto mb-2 rounded-md p-2 lg:max-w-[1300px] lg:p-4 xl:max-w-[1600px]"
    >
      <div className="flex flex-col gap-1">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
          {t("pageTitle")}
        </h1>
        <p className="text-muted-foreground">{t("pageDescription")}</p>
      </div>
      <div className="mt-10">
        <div className="flex flex-col gap-10">
          <PreferredCurrencySettings
            title={t("currencySettingsTitle")}
            description={t("currencySettingsDescription")}
          />
          <NotificationSettings
            title={t("notificationSettingsTitle")}
            description={t("notificationSettingsDescription")}
          />
          <ColorThemeSettings
            title={t("colorThemeSettingsTitle")}
            description={t("colorThemeSettingsDescription")}
          />
          <TwoFactorAuthenticationSettings
            internationalizationConfig={{
              twoFactorSettingsTitle: t("twoFactorSettingsTitle"),
              twoFactorAlreadyEnableDescription: t(
                "twoFactorAlreadyEnableDescription"
              ),
              twoFactorSettingsDescription: t("twoFactorSettingsDescription"),
              twoFactorDisableDialogTitle: t("twoFactorDisableDialogTitle"),
              twoFactorDisableDialogMessage: t("twoFactorDisableDialogMessage"),
              twoFactorDisableDialogPrimaryActionLabel: t(
                "twoFactorDisableDialogPrimaryActionLabel"
              ),
              twoFactorEnableDialogTitle: t("twoFactorEnableDialogTitle"),
              twoFactorEnableDialogMessage: t("twoFactorEnableDialogMessage"),
              twoFactorToastInfoMessage: t("twoFactorToastInfoMessage"),
              twoFactorEnableDialogPrimaryActionLabel: t(
                "twoFactorEnableDialogPrimaryActionLabel"
              ),
              twoFactorEnablePending: t("twoFactorEnablePending"),
              twoFactorEnableCTA: t("twoFactorEnableCTA"),
              twoFactorDisablePeding: t("twoFactorDisablePeding"),
              twoFactorDisableCTA: t("twoFactorDisableCTA"),
              twoFactorFormStepOne: t("twoFactorFormStepOne"),
              twoFactorFormStepTwo: t("twoFactorFormStepTwo"),
              twoFactorFormStepThree: t("twoFactorFormStepThree"),
              twoFactorCopyToClipboardSuccessMessage: t(
                "twoFactorCopyToClipboardSuccessMessage"
              ),
              twoFactorCopyToClipboardCTA: t("twoFactorCopyToClipboardCTA"),
              twoFactorCodeInputLabel: t("twoFactorCodeInputLabel"),
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;
