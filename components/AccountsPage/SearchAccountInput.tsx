"use client";
import { ChangeEvent, useEffect } from "react";
import { Input } from "../ui/input";
import { useDebounceValue } from "usehooks-ts";
import { FaSearch } from "react-icons/fa";
import { useQueryState } from "nuqs";

const SearchAccountInput = () => {
  const [searchQuery, setSearchQuery] = useQueryState("query", {
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
    <div className="relative lg:w-96 mb-2  w-full">
      <Input
        defaultValue={searchQuery || ""}
        className="pl-8"
        onChange={handleInputChange}
        placeholder="Search accounts by name"
      />
      <FaSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );
};
export default SearchAccountInput;
