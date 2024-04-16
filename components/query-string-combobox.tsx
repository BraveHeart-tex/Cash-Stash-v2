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

type QueryStringComboboxItem = {
  label: string;
  value: string;
};

type QueryStringComboBoxProps = {
  dataset: QueryStringComboboxItem[];
  queryStringKey: string;
  defaultValue?: string;
  selectLabel?: string;
};

const QueryStringComboBox = ({
  dataset,
  queryStringKey,
  defaultValue = "",
  selectLabel,
}: QueryStringComboBoxProps) => {
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
      <SelectContent className="max-h-[300px] overflow-auto">
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

export default QueryStringComboBox;
