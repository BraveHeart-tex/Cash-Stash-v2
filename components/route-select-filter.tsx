"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";

const RouteSelectFilter = ({
  dataset,
  queryStringKey,
  defaultValue = "",
  selectLabel,
}: {
  dataset: {
    label: string;
    value: string;
  }[];
  queryStringKey: string;
  defaultValue?: string;
  selectLabel?: string;
}) => {
  const [key, setKey] = useQueryState(queryStringKey, {
    defaultValue,
    shallow: false,
  });

  const handleValueChange = (value: string) => {
    setKey(value);
  };

  const readableLabel = dataset.find((item) => item.value === key)?.label;

  return (
    <Select defaultValue={"All"} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full lg:w-[180px]">
        <SelectValue>{readableLabel || "All"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          <SelectItem value={""}>All</SelectItem>
          {dataset.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default RouteSelectFilter;
