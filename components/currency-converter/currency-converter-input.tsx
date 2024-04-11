"use client";

import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { useDebounceValue } from "usehooks-ts";
import { useEffect, useState } from "react";
import CurrencySelectCombobox from "@/components/currency-converter/curreny-select-combobox";
import { format } from "date-fns";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { Button } from "@/components/ui/button";
import {
  HiOutlineSwitchHorizontal,
  HiOutlineSwitchVertical,
} from "react-icons/hi";

const CurrencyConverterInput = ({
  updatedAt,
  convertedToCurrencyAmount,
}: {
  updatedAt: string;
  convertedToCurrencyAmount: number;
}) => {
  const [currency, setCurrency] = useQueryState("currency", {
    shallow: false,
  });
  const [amount, setAmount] = useQueryState("amount", {
    shallow: false,
    defaultValue: "1",
  });
  const [toCurrency, setToCurrency] = useQueryState("to", {
    shallow: false,
    defaultValue: "EUR",
  });

  const [inputValue, setInputValue] = useState("");
  const [debouncedAmount, setDebouncedAmount] = useDebounceValue("", 200);

  useEffect(() => {
    setAmount(debouncedAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmount]);

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

  const maskedConvertedToCurrencyAmount = formatMoney(
    convertedToCurrencyAmount,
    toCurrency || "EUR"
  );

  const handleCurrencySwitch = () => {
    setCurrency(toCurrency);
    setToCurrency(currency);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
        <div>
          <div className="flex items-center justify-between">
            <CurrencySelectCombobox queryKey="currency" />
            <span className="text-muted-foreground ml-auto">
              Last Updated: {format(new Date(updatedAt), "dd/MM/yyyy HH:mm")}
            </span>
          </div>
          <div className="flex items-center flex-col lg:flex-row">
            <Input
              value={inputValue}
              defaultValue={amount}
              onChange={handleInputChange}
              className="text-base"
            />
            <Button
              size="icon"
              variant="ghost"
              className="mt-4 lg:mt-0 lg:ml-4 flex items-center gap-1"
              onClick={handleCurrencySwitch}
            >
              <HiOutlineSwitchHorizontal className="hidden lg:inline" />
              <HiOutlineSwitchVertical className="lg:hidden" />
            </Button>
          </div>
        </div>

        <div className="flex items-center flex-col">
          <CurrencySelectCombobox
            defaultValue="EUR"
            queryKey="to"
            triggerClassName="self-start"
          />
          <Input
            disabled
            value={maskedConvertedToCurrencyAmount}
            className="disabled:opacity-75 text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterInput;
