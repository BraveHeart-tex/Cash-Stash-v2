export function parseCurrencyToNumber(currencyString: string): number {
  let regex = /[^\d.-]+/g;
  let cleanedString = currencyString.replace(regex, "");
  return parseFloat(cleanedString);
}
