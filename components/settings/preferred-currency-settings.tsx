import { getCurrencies } from "@/actions/currency";
import CurrencyCombobox from "@/components/settings/currency-combobox";

const PreferredCurrencySettings = async () => {
  const currencies = await getCurrencies();
  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold text-primary">
          Preffered Currency
        </h2>
        <p className="text-muted-foreground">
          Choose your preferred currency for displaying amounts.
        </p>
      </div>
      <CurrencyCombobox
        currencies={currencies.map((item) => ({
          label: item.name + " (" + item.symbol + ")",
          value: item.symbol,
        }))}
      />
    </div>
  );
};

export default PreferredCurrencySettings;
