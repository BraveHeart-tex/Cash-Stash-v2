"use client";
import { useQueryState } from "nuqs";
import Combobox from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { QueryStringComboboxItem } from "@/server/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QueryStringComboBoxProps = {
  dataset: QueryStringComboboxItem[];
  queryStringKey: string;
  defaultValue?: string;
  selectLabel?: string;
  renderAsSelect?: boolean;
};

const QueryStringComboBox = ({
  dataset,
  queryStringKey,
  defaultValue = "",
  selectLabel,
  renderAsSelect = false,
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
    <div>
      <Label>{selectLabel}</Label>
      {renderAsSelect ? (
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
      ) : (
        <Combobox
          options={[
            {
              label: "All",
              value: "",
            },
            ...dataset,
          ]}
          onSelect={(option) => {
            handleValueChange(option.value);
          }}
          contentClassName="w-full"
          triggerPlaceholder={readableLabel || "All"}
        />
      )}
    </div>
  );
};

export default QueryStringComboBox;
