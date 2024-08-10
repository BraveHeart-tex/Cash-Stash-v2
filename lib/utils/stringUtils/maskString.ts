export type MaskOptions = {
  /** The string to be prepended to the masked value. */
  prefix?: string;
  /** The string to be appended to the masked value. */
  suffix?: string;
  /** Whether to include a thousands separator in the masked value. */
  includeThousandsSeparator?: boolean;
  /** The symbol used as the thousands separator in the masked value. */
  thousandsSeparatorSymbol?: string;
  /** Whether to allow a decimal component in the masked value. */
  allowDecimal?: boolean;
  /** The symbol used as the decimal component in the masked value. */
  decimalSymbol?: string;
  /** The maximum number of decimal places in the masked value. */
  decimalLimit?: number;
  /** The maximum number of integer digits in the masked value. */
  integerLimit?: number;
  /** Whether to allow negative values in the masked value. */
  allowNegative?: boolean;
  /** Whether to allow leading zeroes in the masked value. */
  allowLeadingZeroes?: boolean;
};

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
      thousandsSeparatorSymbol,
    );
  }

  let maskedString = isNegative ? `-${prefix}` : prefix;
  maskedString += integerPart;
  if (allowDecimal && decimalPart !== undefined) {
    maskedString += decimalSymbol + decimalPart;
  }
  maskedString += suffix;

  return maskedString;
}
