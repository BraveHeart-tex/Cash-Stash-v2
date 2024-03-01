"use client";
import { useQueryState } from "nuqs";

const TransactionFilters = () => {
  const [name, setName] = useQueryState("name", {
    shallow: false,
  });

  return <div></div>;
};

export default TransactionFilters;
