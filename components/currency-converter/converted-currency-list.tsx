"use client";
import { ConvertCurrencyType } from "@/actions/types";
import { CURRENCIES, FLAGS_BY_CURRENCY_SYMBOL } from "@/lib/constants";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { thousandSeparator } from "@/lib/utils/numberUtils/thousandSeparator";
import { useQueryState } from "nuqs";

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
          <li
            key={item.symbol}
            className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer"
            onClick={() => setSelectedCurrency(item.symbol)}
          >
            <div className="flex items-center">
              <span className="text-lg mr-1">
                {FLAGS_BY_CURRENCY_SYMBOL[item.symbol]}
              </span>
              <span className="text-lg">{item.label}</span>
            </div>
            <span className="text-lg">
              {formatMoney(item.amount, item.symbol)}
            </span>
          </li>
        ))}
    </ul>
  );
};

export default ConvertedCurrencyList;
