import { FLAGS_BY_CURRENCY_SYMBOL } from "@/lib/constants";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import type { ConvertCurrencyType } from "@/typings/currencies";

type ConvertedCurrencyListItemProps = {
  item: ConvertCurrencyType;
  setSelectedCurrency: (value: string) => void;
};

const CurrencyConverterListItem = ({
  item,
  setSelectedCurrency,
}: ConvertedCurrencyListItemProps) => {
  return (
    <li
      aria-label={item.label}
      title={item.label}
      className="flex cursor-pointer items-center justify-between text-ellipsis rounded-md p-2 hover:bg-accent"
      onClick={() => setSelectedCurrency(item.symbol)}
      onKeyUp={() => setSelectedCurrency(item.symbol)}
    >
      <div className="flex items-center">
        <span className="mr-1 text-lg">
          {FLAGS_BY_CURRENCY_SYMBOL[item.symbol]}
        </span>
        <span className="text-lg">{item.label}</span>
      </div>
      <span className="text-lg">{formatMoney(item.amount, item.symbol)}</span>
    </li>
  );
};
export default CurrencyConverterListItem;
