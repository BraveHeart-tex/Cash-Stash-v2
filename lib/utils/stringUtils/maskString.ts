import { MaskOptions } from "@/server/types";

export function maskString(input: string, options: MaskOptions) {
  const {
    prefix = "$",
    suffix = "",
    includeThousandsSeparator = true,
    thousandsSeparatorSymbol = ",",
    allowDecimal = true,
    decimalSymbol = ".",
    decimalLimit = 2,
    integerLimit = 7,
    allowNegative = true,
    allowLeadingZeroes = false,
  } = options;

  let numericString = input.replace(/[^\d.-]/g, "");

  let isNegative = false;
  if (!allowNegative) {
    numericString = numericString.replace(/-/g, "");
  } else if (numericString.startsWith("-")) {
    isNegative = true;
    numericString = numericString.slice(1);
  }

  if (!allowLeadingZeroes) {
    numericString = numericString.replace(/^0+/, "");
  }

  let [integerPart, decimalPart] = numericString.split(decimalSymbol);

  if (integerPart.length > integerLimit) {
    integerPart = integerPart.slice(0, integerLimit);
  }

  if (decimalPart && decimalPart.length > decimalLimit) {
    decimalPart = decimalPart.slice(0, decimalLimit);
  }

  if (includeThousandsSeparator) {
    integerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      thousandsSeparatorSymbol
    );
  }

  let maskedString = isNegative ? "-" + prefix : prefix;
  maskedString += integerPart;
  if (allowDecimal && decimalPart !== undefined) {
    maskedString += decimalSymbol + decimalPart;
  }
  maskedString += suffix;

  return maskedString;
}