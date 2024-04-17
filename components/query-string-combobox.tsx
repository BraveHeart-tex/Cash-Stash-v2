"use client";
import { useQueryState } from "nuqs";
import Combobox from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { QueryStringComboboxItem } from "@/server/types";

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
    <div>
      <Label>{selectLabel}</Label>
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
    </div>
  );
};

export default QueryStringComboBox;
