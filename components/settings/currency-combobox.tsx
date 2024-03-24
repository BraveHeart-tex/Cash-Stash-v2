"use client";
import { IComboboxOption } from "@/actions/types";
import Combobox from "@/components/ui/combobox";

const CurrencyCombobox = ({
  currencies,
}: {
  currencies: IComboboxOption[];
}) => {
  return (
    <Combobox
      triggerClassName="w-full md:w-[400px] whitespace-nowrap"
      options={currencies}
      onSelect={console.log}
    />
  );
};
export default CurrencyCombobox;
