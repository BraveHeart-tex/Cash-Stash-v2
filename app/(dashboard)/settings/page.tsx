import NotificationSettings from "@/components/settings/notification-settings";
import PreferredCurrencySettings from "@/components/settings/preferred-currency-settings";
import TwoFactorAuthenticationSettings from "@/components/settings/two-factor-authentication-settings";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return (
    <div>
      <div className="rounded-md p-2 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px] mb-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-4xl text-primary">Settings</h3>
          <p className="text-muted-foreground">
            Personalize your CashStash experience.
          </p>
        </div>
        <div className="mt-10">
          <div className="flex flex-col gap-10">
            <PreferredCurrencySettings />
            <NotificationSettings />
            <TwoFactorAuthenticationSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
