"use client";
import { ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounceValue } from "usehooks-ts";
import { FaSearch } from "react-icons/fa";
import { useQueryState } from "nuqs";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

type RouteSearchInputProps = {
  placeholder: string;
};

const RouteSearchInput = ({ placeholder }: RouteSearchInputProps) => {
  const t = useTranslations("Components.RouteSearchInput");
  const [, setSearchQuery] = useQueryState("query", {
    shallow: false,
  });
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue("", 400);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDebouncedQuery(value);
  };

  useEffect(() => {
    setSearchQuery(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div className="w-full lg:w-96">
      <Label htmlFor="search">{t("label")}</Label>
      <div className="relative">
        <Input
          id="search"
          autoComplete="off"
          className="pl-7"
          onChange={handleInputChange}
          placeholder={placeholder}
        />
        <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 transform text-foreground/50" />
      </div>
    </div>
  );
};

export default RouteSearchInput;
