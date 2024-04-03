"use client";
import { ConvertCurrencyType } from "@/actions/types";
import { useQueryState } from "nuqs";
import CurrencyConverterListItem from "./converted-currency-list-item";

const ConvertedCurrencyList = ({
  currencyList,
}: {
  currencyList: ConvertCurrencyType[];
}) => {
  const [selectedCurrency, setSelectedCurrency] = useQueryState("currency", {
    shallow: false,
    defaultValue: "USD",
  });

  return (
    <ul className="grid grid-cols-1 border p-2 rounded-md mt-2 lg:grid-cols-2 xl:grid-cols-3 max-h-[300px] lg:max-h-[500px] overflow-auto">
      {currencyList
        .filter((item) => item.symbol !== selectedCurrency)
        .map((item) => (
          <CurrencyConverterListItem
            key={item.symbol}
            item={item}
            setSelectedCurrency={setSelectedCurrency}
          />
        ))}
    </ul>
  );
};

export default ConvertedCurrencyList;
