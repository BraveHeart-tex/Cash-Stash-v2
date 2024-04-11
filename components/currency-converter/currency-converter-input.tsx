"use client";

import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { useDebounceValue } from "usehooks-ts";
import { useEffect, useState } from "react";
import getCurrencyAmblem from "@/lib/utils/stringUtils/getCurrencyAmblem";
import CurrencySelectCombobox from "./curreny-select-combobox";
import { format } from "date-fns";

const CurrencyConverterInput = ({ updatedAt }: { updatedAt: string }) => {
  const [selectedCurrency] = useQueryState("currency", {
    shallow: false,
    defaultValue: "USD",
  });
  const [amount, setAmount] = useQueryState("amount", {
    shallow: false,
    defaultValue: "1",
  });
  const [inputValue, setInputValue] = useState("");
  const [debouncedAmount, setDebouncedAmount] = useDebounceValue("", 300);

  useEffect(() => {
    setAmount(debouncedAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmount]);

  const currencyAmblem = selectedCurrency
    ? getCurrencyAmblem(selectedCurrency)
    : "";

  const toggleMask = (value: string, mask: boolean) => {
    if (mask) {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return value.replace(/,/g, "");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const unMaskedValue = toggleMask(value, false);

    if (Number(unMaskedValue) >= 99999999) {
      setDebouncedAmount("99999999");
      setInputValue(toggleMask("99999999", true));
      return;
    }

    setDebouncedAmount(unMaskedValue || "1");
    setInputValue(toggleMask(unMaskedValue, true));
  };

  return (
    <div className="flex flex-col w-full lg:w-[50%]">
      <div className="flex items-center justify-between text-foreground">
        <CurrencySelectCombobox />
        <span className="text-muted-foreground">
          Last Updated: {format(new Date(updatedAt), "dd/MM/yyyy HH:mm")}
        </span>
      </div>
      <div className="w-full">
        <Input
          value={inputValue}
          defaultValue={amount}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default CurrencyConverterInput;
