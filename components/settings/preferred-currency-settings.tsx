import CurrencyCombobox from "@/components/settings/currency-combobox";
import { CURRENCIES } from "@/lib/constants";

type PreferredCurrencySettingsProps = {
  title: string;
  description: string;
};

const PreferredCurrencySettings = async ({
  title,
  description,
}: PreferredCurrencySettingsProps) => {
  return (
    <section id="preferred-currency" className="flex flex-col gap-2">
      <div>
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
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
