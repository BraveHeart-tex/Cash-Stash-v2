"use client";
import { CURRENCIES, FLAGS_BY_CURRENCY_SYMBOL } from "@/lib/constants";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { useQueryState } from "nuqs";

const ConvertedCurrencyList = ({ currencyRate }: { currencyRate: number }) => {
  const [selectedCurrency] = useQueryState("currency", {
    shallow: false,
    defaultValue: "USD",
  });

  const currencyList = CURRENCIES.filter(
    (item) => item.symbol !== selectedCurrency
  );

  return (
    <div className="grid grid-cols-1 border p-2 rounded-md mt-2 lg:grid-cols-2 xl:grid-cols-3 max-h-[300px] lg:max-h-[500px] overflow-auto">
      {currencyList.map((item) => (
        <button
          key={item.symbol}
          className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer"
        >
          <div className="flex items-center">
            <span className="text-lg mr-1">
              {FLAGS_BY_CURRENCY_SYMBOL[item.symbol]}
            </span>
            <span className="text-lg">{item.name}</span>
          </div>
          <span className="text-lg">{formatMoney(10, selectedCurrency)}</span>
        </button>
      ))}
    </div>
  );
};

export default ConvertedCurrencyList;
