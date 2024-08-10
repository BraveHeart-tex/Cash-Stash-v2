import CurrencyCombobox from "@/components/settings/currency-combobox";
import { getTranslations } from "next-intl/server";

type PreferredCurrencySettingsProps = {
  title: string;
  description: string;
};

const PreferredCurrencySettings = async ({
  title,
  description,
}: PreferredCurrencySettingsProps) => {
  const t = await getTranslations("Lists");
  const settingsT = await getTranslations("Settings");

  const mappedCurrencies = t("currencies")
    .split(", ")
    .map((s) => s.split(":"))
    .map(([name, symbol]) => ({ name, symbol }))
    .map(({ name, symbol }) => ({
      label: `${name} (${symbol})`,
      value: symbol,
    }));

  return (
    <section id="preferred-currency" className="flex flex-col gap-2">
      <div>
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <CurrencyCombobox
        currencies={mappedCurrencies}
        internationalizationConfig={{
          convertCurrencyDialogDescription: settingsT(
            "convertCurrencyDialogDescription",
          ),
          convertCurrencyDialogTitle: settingsT("convertCurrencyDialogTitle"),
          changeCurrencyDialogMessage: settingsT("changeCurrencyDialogMessage"),
          changeCurrencyDialogTitle: settingsT("changeCurrencyDialogTitle"),
          changeCurrencyPending: settingsT("changeCurrencyPending"),
          changeCurrencyPrimaryActionLabel: settingsT(
            "changeCurrencyPrimaryActionLabel",
          ),
          changeCurrencySuccessMessage: settingsT(
            "changeCurrencySuccessMessage",
          ),
          convertCurrencyPending: settingsT("convertCurrencyPending"),
          convertCurrencyPrimaryActionLabel: settingsT(
            "convertCurrencyPrimaryActionLabel",
          ),
          convertCurrencySecondaryActionLabel: settingsT(
            "convertCurrencySecondaryActionLabel",
          ),
          convertCurrencySuccessMessage: settingsT(
            "convertCurrencySuccessMessage",
          ),
          currencySaveRejectMessage: settingsT("currencySaveRejectMessage"),
          currencySaveSuccessMessage: settingsT("currencySaveSuccessMessage"),
          changeCurrencySaveLabel: settingsT("changeCurrencySaveLabel"),
        }}
      />
    </section>
  );
};

export default PreferredCurrencySettings;
