"use client";
import CurrencyConverterListItem from "@/components/currency-converter/converted-currency-list-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ConvertCurrencyType } from "@/typings/currencies";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdQuestionMark } from "react-icons/md";

type ConvertedCurrencyListProps = {
  currencyList: ConvertCurrencyType[];
};

const ConvertedCurrencyList = ({
  currencyList,
}: ConvertedCurrencyListProps) => {
  const t = useTranslations("Components.ConvertedCurrencyList");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useQueryState("currency", {
    shallow: false,
    defaultValue: "USD",
  });

  const filteredCurrencies = currencyList.filter(
    (item) =>
      item.symbol !== selectedCurrency &&
      (item?.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <section className="relative mt-2 h-[calc(100vh-545px)] flex-grow overflow-auto rounded-md border px-2 lg:h-[calc(100vh-400px)]">
      <div className="sticky top-0 z-10 flex w-full flex-col gap-1 rounded-md bg-background py-1">
        <Label htmlFor="search-currency">{t("searchLabel")}</Label>
        <div className="relative w-full lg:w-[400px]">
          <Input
            id="search-currency"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-8"
            placeholder={t("searchPlaceholder")}
          />
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          {searchQuery && (
            <Button
              type="button"
              name="clear-search"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-0 text-muted-foreground"
              onClick={() => setSearchQuery("")}
            >
              <FaXmark />
            </Button>
          )}
        </div>
      </div>
      <ul
        className="grid min-h-[300px] grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
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
          <div className="col-span-4 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <MdQuestionMark className="text-2xl" />
              <p className="font-medium text-foreground">
                {t("noResultsMessage")}
              </p>
              <Button
                type="button"
                name="clear-search"
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                {t("clearSearchButtonLabel")}
              </Button>
            </div>
          </div>
        ) : null}
      </ul>
    </section>
  );
};

export default ConvertedCurrencyList;
