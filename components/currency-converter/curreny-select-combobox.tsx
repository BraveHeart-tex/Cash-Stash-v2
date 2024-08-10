"use client";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { CURRENCIES, FLAGS_BY_CURRENCY_SYMBOL } from "@/lib/constants";
import { cn } from "@/lib/utils/stringUtils/cn";
import { getTranslatedLabelForCurrency } from "@/lib/utils/translationUtils/getTranslatedLabelForCurrency";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { FaChevronDown } from "react-icons/fa";

const CurrencySelectCombobox = ({
  queryKey,
  triggerClassName,
  defaultValue = "USD",
}: {
  queryKey: string;
  triggerClassName?: string;
  defaultValue?: string;
}) => {
  const t = useTranslations("Lists");

  const [value, setValue] = useQueryState(queryKey, {
    shallow: false,
    defaultValue,
  });

  const flagEmoji = value ? FLAGS_BY_CURRENCY_SYMBOL[value] : "";

  const selectedOption =
    CURRENCIES.find((item) => item.symbol === value) || CURRENCIES[0];

  return (
    <Combobox
      onSelect={(option) => {
        setValue(option.value);
      }}
      trigger={
        <Button variant="ghost" className={cn("p-1 text-lg", triggerClassName)}>
          <span className="mr-1 text-2xl">{flagEmoji}</span> {value}
          <FaChevronDown className="ml-1" />
        </Button>
      }
      defaultOption={{
        label:
          getTranslatedLabelForCurrency(t, selectedOption.symbol) +
          " (" +
          selectedOption.symbol +
          ")",
        value: selectedOption.symbol,
      }}
      options={CURRENCIES.map((item) => ({
        label:
          getTranslatedLabelForCurrency(t, item.symbol) +
          " (" +
          item.symbol +
          ")",
        value: item.symbol,
      }))}
    />
  );
};

export default CurrencySelectCombobox;
