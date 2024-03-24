"use client";
import { IComboboxOption } from "@/actions/types";
import Combobox from "../ui/combobox";

const CurrencyCombobox = ({
  currencies,
}: {
  currencies: IComboboxOption[];
}) => {
  return <Combobox options={currencies} onSelect={console.log} />;
};
export default CurrencyCombobox;
