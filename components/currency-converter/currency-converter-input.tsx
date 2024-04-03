"use client";

import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { useDebounceValue } from "usehooks-ts";
import { useEffect } from "react";
import { cn } from "@/lib/utils/stringUtils/cn";
import getCurrencyAmblem from "@/lib/utils/stringUtils/getCurrencyAmblem";
import CurrencySelectCombobox from "./curreny-select-combobox";

const CurrencyConverterInput = () => {
  const [selectedCurrency] = useQueryState("currency", {
    shallow: false,
    defaultValue: "USD",
  });
  const [amount, setAmount] = useQueryState("amount", {
    shallow: false,
    defaultValue: "1",
  });
  const [debouncedAmount, setDebouncedAmount] = useDebounceValue("", 300);

  useEffect(() => {
    setAmount(debouncedAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmount]);

  const currencyAmblem = selectedCurrency
    ? getCurrencyAmblem(selectedCurrency)
    : "";

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || "1";
    setDebouncedAmount(value);
  };

  return (
    <div className="flex flex-col w-full lg:w-[50%]">
      <div className="flex items-center justify-between text-foreground">
        <CurrencySelectCombobox />
        <span className="text-muted-foreground">
          Last Updated: {new Date().toLocaleDateString()}
        </span>
      </div>
      <div className="relative w-full">
        <Input
          className={cn(currencyAmblem.length > 2 ? "pl-14" : "pl-6")}
          type="number"
          defaultValue={amount || ""}
          onChange={handleInputChange}
        />

        <div className="bg-primary h-full text-primary-foreground rounded-sm p-1 w-max absolute top-0 left-0 flex items-center justify-center">
          {currencyAmblem}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterInput;
