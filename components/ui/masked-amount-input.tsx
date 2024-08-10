"use client";
import { Input } from "@/components/ui/input";
import { parseCurrencyToNumber } from "@/lib/utils/numberUtils/parseCurrencyToNumber";
import getCurrencyAmblem from "@/lib/utils/stringUtils/getCurrencyAmblem";
import { maskString } from "@/lib/utils/stringUtils/maskString";
import useAuthStore from "@/store/auth/authStore";
import { type ChangeEvent, forwardRef, useEffect, useState } from "react";

type MaskedAmountInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  // eslint-disable-next-line no-unused-vars
  onMaskedValueChange?: (unMaskedValue: number) => void;
  initialValue?: number;
};

const MaskedAmountInput = forwardRef<HTMLInputElement, MaskedAmountInputProps>(
  ({ onMaskedValueChange, initialValue = "", ...props }, ref) => {
    const preferredCurrency = useAuthStore(
      (state) => state.user?.preferredCurrency,
    );
    const maskConfig = {
      prefix: getCurrencyAmblem(preferredCurrency!),
    };
    const [maskedValue, setMaskedValue] = useState(
      initialValue ? maskString(initialValue.toString(), maskConfig) : "",
    );

    useEffect(() => {
      const maskedValue = maskString(initialValue.toString(), {
        prefix: getCurrencyAmblem(preferredCurrency!),
      });
      setMaskedValue(maskedValue);
    }, [initialValue, preferredCurrency]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const maskedValue = maskString(value, maskConfig);

      setMaskedValue(maskedValue);
      onMaskedValueChange?.(parseCurrencyToNumber(maskedValue));
    };

    return (
      <Input
        value={maskedValue}
        onChange={handleChange}
        inputMode="numeric"
        ref={ref}
        {...props}
      />
    );
  },
);

MaskedAmountInput.displayName = "MaskedAmountInput";

export default MaskedAmountInput;
