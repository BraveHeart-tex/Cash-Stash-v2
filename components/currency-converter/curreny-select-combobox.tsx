"use client";
import { useQueryState } from "nuqs";
import { CURRENCIES, FLAGS_BY_CURRENCY_SYMBOL } from "@/lib/constants";
import Combobox from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import { cn } from "@/lib/utils/stringUtils/cn";

const CurrencySelectCombobox = ({
  queryKey,
  triggerClassName,
}: {
  queryKey: string;
  triggerClassName?: string;
}) => {
  const [value, setValue] = useQueryState(queryKey, {
    shallow: false,
    defaultValue: "USD",
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
        <Button variant="ghost" className={cn("text-lg p-1", triggerClassName)}>
          <span className="text-2xl mr-1">{flagEmoji}</span> {value}
          <FaChevronDown className="ml-1" />
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
