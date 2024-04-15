import { ConvertCurrencyType } from "@/server/types";
import { FLAGS_BY_CURRENCY_SYMBOL } from "@/lib/constants";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";

const CurrencyConverterListItem = ({
  item,
  setSelectedCurrency,
}: {
  item: ConvertCurrencyType;
  setSelectedCurrency: (value: string) => void;
}) => {
  return (
    <li
      className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer text-ellipsis"
      onClick={() => setSelectedCurrency(item.symbol)}
    >
      <div className="flex items-center">
        <span className="text-lg mr-1">
          {FLAGS_BY_CURRENCY_SYMBOL[item.symbol]}
        </span>
        <span className="text-lg">{item.label}</span>
      </div>
      <span className="text-lg">{formatMoney(item.amount, item.symbol)}</span>
    </li>
  );
};
export default CurrencyConverterListItem;
