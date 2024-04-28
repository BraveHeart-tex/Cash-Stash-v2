import ColorThemeSettings from "@/components/settings/color-theme-settings";
import NotificationSettings from "@/components/settings/notification-settings";
import PreferredCurrencySettings from "@/components/settings/preferred-currency-settings";
import TwoFactorAuthenticationSettings from "@/components/settings/two-factor-authentication-settings";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { redirect } from "@/navigation";

const SettingsPage = async () => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return (
    <section
      id="settings"
      className="mx-auto mb-2 rounded-md p-2 lg:max-w-[1300px] lg:p-4 xl:max-w-[1600px]"
    >
      <div className="flex flex-col gap-1">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Personalize your CashStash experience.
        </p>
      </div>
      <div className="mt-10">
        <div className="flex flex-col gap-10">
          <PreferredCurrencySettings />
          <NotificationSettings />
          <ColorThemeSettings />
          <TwoFactorAuthenticationSettings />
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;
