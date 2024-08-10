export function parseCurrencyToNumber(currencyString: string): number {
  const regex = /[^\d.-]+/g;
  const cleanedString = currencyString.replace(regex, "");
  return Number.parseFloat(cleanedString);
}
