"use client";
import { ConvertCurrencyType } from "@/actions/types";
import { useQueryState } from "nuqs";
import CurrencyConverterListItem from "./converted-currency-list-item";
import { Input } from "../ui/input";
import { useState } from "react";
import { Label } from "../ui/label";
import { FaSearch } from "react-icons/fa";
import { MdQuestionMark } from "react-icons/md";
import { Button } from "../ui/button";

const ConvertedCurrencyList = ({
  currencyList,
}: {
  currencyList: ConvertCurrencyType[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useQueryState("currency", {
    shallow: false,
    defaultValue: "USD",
  });

  const filteredCurrencies = currencyList.filter(
    (item) =>
      item.symbol !== selectedCurrency &&
      (item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative border px-2 rounded-md mt-2 max-h-[300px] lg:max-h-[500px] overflow-auto">
      <div className="flex flex-col gap-1 sticky top-0 bg-background w-full z-10 rounded-md py-1">
        <Label>Search</Label>
        <div className="relative w-full lg:w-[400px]">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            placeholder="Search for currency..."
          />
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      <ul
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 min-h-[300px]"
        style={{
          gridAutoRows: "min-content",
        }}
      >
        {filteredCurrencies.map((item) => (
          <CurrencyConverterListItem
            key={item.symbol}
            item={item}
            setSelectedCurrency={setSelectedCurrency}
          />
        ))}

        {searchQuery && filteredCurrencies.length === 0 ? (
          <div className="text-center col-span-4">
            <div className="flex flex-col gap-2 justify-center items-center">
              <MdQuestionMark className="text-2xl" />
              <p className="text-foreground font-medium">
                No results were found for your search
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          </div>
        ) : null}
      </ul>
    </div>
  );
};

export default ConvertedCurrencyList;
