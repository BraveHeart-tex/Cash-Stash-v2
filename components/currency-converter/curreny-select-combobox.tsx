"use client";
import { useQueryState } from "nuqs";
import { CURRENCIES, FLAGS_BY_CURRENCY_SYMBOL } from "@/lib/constants";
import Combobox from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

const CurrencySelectCombobox = () => {
  const [selectedCurrency, setSelectedCurrency] = useQueryState("currency", {
    shallow: false,
    defaultValue: "USD",
  });

  const flagEmoji = selectedCurrency
    ? FLAGS_BY_CURRENCY_SYMBOL[selectedCurrency]
    : "";

  const selectedOption =
    CURRENCIES.find((item) => item.symbol === selectedCurrency) ||
    CURRENCIES[0];

  return (
    <Combobox
      onSelect={(option) => {
        setSelectedCurrency(option.value);
      }}
      trigger={
        <Button variant="ghost" className="text-lg p-1">
          <span className="text-2xl mr-1">{flagEmoji}</span> {selectedCurrency}
        </Button>
      }
      defaultOption={{
        label: selectedOption.name + " (" + selectedOption.symbol + ")",
        value: selectedOption.symbol,
      }}
      options={CURRENCIES.map((item) => ({
        label: item.name + " (" + item.symbol + ")",
        value: item.symbol,
      }))}
    />
  );
};

export default CurrencySelectCombobox;
