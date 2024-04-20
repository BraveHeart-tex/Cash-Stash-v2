import CurrencyCombobox from "@/components/settings/currency-combobox";
import { CURRENCIES } from "@/lib/constants";

const PreferredCurrencySettings = async () => {
  return (
    <section id="preferred-currency" className="flex flex-col gap-2">
      <div>
        <h2 className="text-xl font-semibold text-primary">
          Preffered Currency
        </h2>
        <p className="text-muted-foreground">
          Choose your preferred currency for displaying amounts.
        </p>
      </div>
      <CurrencyCombobox
        currencies={CURRENCIES.map((item) => ({
          label: item.name + " (" + item.symbol + ")",
          value: item.symbol,
        }))}
      />
    </section>
  );
};

export default PreferredCurrencySettings;
