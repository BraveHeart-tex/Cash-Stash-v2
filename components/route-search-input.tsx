"use client";
import { ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounceValue } from "usehooks-ts";
import { FaSearch } from "react-icons/fa";
import { useQueryState } from "nuqs";
import { Label } from "./ui/label";

const RouteSearchInput = ({
  placeholder,
  label,
}: {
  placeholder: string;
  label: string;
}) => {
  const [searchQuery, setSearchQuery] = useQueryState("query", {
    shallow: false,
  });
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue("", 300);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDebouncedQuery(value);
  };

  useEffect(() => {
    setSearchQuery(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div className="lg:w-96 w-full">
      <Label htmlFor="search">{label}</Label>
      <div className="relative">
        <Input
          id="search"
          className="pl-7"
          onChange={handleInputChange}
          placeholder={placeholder}
        />
        <FaSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-foreground/50" />
      </div>
    </div>
  );
};

export default RouteSearchInput;
