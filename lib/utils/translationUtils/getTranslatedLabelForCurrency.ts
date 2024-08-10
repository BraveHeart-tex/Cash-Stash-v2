/* eslint-disable no-unused-vars */
import type { Formats, TranslationValues } from "next-intl";

export const getTranslatedLabelForCurrency = (
  t: (
    key: "currencies",
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string,
  currencySymbol: string,
) => {
  return t("currencies")
    .split(", ")
    .map((s) => s.split(":"))
    .map(([name, symbol]) => ({ name, symbol }))
    .find(({ symbol }) => symbol === currencySymbol)?.name;
};
