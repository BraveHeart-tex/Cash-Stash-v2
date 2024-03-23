import PreferredCurrencySettings from "./preferred-currency-settings";
import TwoFactorAuthenticationSettings from "./two-factor-authentication-settings";

const SettingsList = () => {
  return (
    <div className="flex flex-col gap-1">
      <PreferredCurrencySettings />
      <TwoFactorAuthenticationSettings />
    </div>
  );
};

export default SettingsList;
