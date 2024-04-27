import { MaskOptions } from "@/lib/utils/stringUtils/maskString";
import React from "react";
import MaskedInput, { MaskedInputProps } from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

type CurrencyInputProps = Partial<MaskedInputProps> & {
  maskOptions?: MaskOptions;
};

const CurrencyInput = ({ maskOptions, ...inputProps }: CurrencyInputProps) => {
  const defaultMaskOptions = {
    prefix: "$",
    suffix: "",
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ",",
    allowDecimal: true,
    decimalSymbol: ".",
    decimalLimit: 2, // how many digits allowed after the decimal
    integerLimit: 7, // limit length of integer numbers
    allowNegative: true,
    allowLeadingZeroes: false,
  };

  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    ...maskOptions,
  });

  return <MaskedInput mask={currencyMask} {...inputProps} />;
};

export default CurrencyInput;
