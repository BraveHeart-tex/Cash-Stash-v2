"use client";

import CurrencySelectCombobox from "@/components/currency-converter/currency-select-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import type React from "react";
import { useEffect, useState } from "react";
import {
  HiOutlineSwitchHorizontal,
  HiOutlineSwitchVertical,
} from "react-icons/hi";
import { useDebounceValue } from "usehooks-ts";

type CurrencyConverterInputProps = {
  updatedAt: string;
  convertedToCurrencyAmount: number;
};

const CurrencyConverterInput = ({
  updatedAt,
  convertedToCurrencyAmount,
}: CurrencyConverterInputProps) => {
  const t = useTranslations("Components.CurrencyConverterInput");
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
  }, [debouncedAmount, setAmount]);

  const toggleMask = (value: string, mask: boolean) => {
    if (mask) {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value.replace(/,/g, "");
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
    toCurrency || "EUR",
  );

  const handleCurrencySwitch = () => {
    const newCurrency = toCurrency;
    const newToCurrency = currency;

    setCurrency(newCurrency);
    setToCurrency(newToCurrency);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="grid w-full grid-cols-1 lg:grid-cols-2 lg:gap-4">
        <div>
          <div className="flex items-center justify-between">
            <CurrencySelectCombobox
              queryKey="currency"
              triggerClassName="w-max"
            />
            <span className="ml-auto text-sm text-muted-foreground">
              {t("lastUpdated", {
                date: format(new Date(updatedAt), "dd/MM/yyyy HH:mm"),
              })}
            </span>
          </div>
          <div className="flex flex-col items-center lg:flex-row">
            <Input
              value={inputValue}
              defaultValue={amount}
              onChange={handleInputChange}
              className="text-base"
            />
            <Button
              size="icon"
              variant="ghost"
              className="mt-4 flex items-center gap-1 lg:ml-4 lg:mt-0"
              onClick={handleCurrencySwitch}
            >
              <HiOutlineSwitchHorizontal className="hidden lg:inline" />
              <HiOutlineSwitchVertical className="lg:hidden" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <CurrencySelectCombobox
            defaultValue="EUR"
            queryKey="to"
            triggerClassName="self-start w-max"
          />
          <Input
            disabled
            value={maskedConvertedToCurrencyAmount}
            className="text-base disabled:opacity-75"
          />
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterInput;
