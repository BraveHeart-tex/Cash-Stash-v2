"use client";
import { useQueryState } from "nuqs";
import Combobox from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export type QueryStringComboboxItem = {
  label: string;
  value: string;
};

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
  const t = useTranslations("Components.QueryStringComboBox");
  const [key, setKey] = useQueryState(queryStringKey, {
    defaultValue,
    shallow: false,
  });

  const handleValueChange = (value: string) => {
    setKey(value);
  };

  const readableLabel = dataset.find((item) => item.value === key)?.label;

  const allLabel = t("allLabel");

  return (
    <div>
      <Label>{selectLabel}</Label>
      {renderAsSelect ? (
        <Select defaultValue={allLabel} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue>{readableLabel || allLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-auto">
            <SelectGroup>
              <SelectLabel>{selectLabel}</SelectLabel>
              <SelectItem value={""}>allLabel</SelectItem>
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
              label: allLabel,
              value: "",
            },
            ...dataset,
          ]}
          onSelect={(option) => {
            handleValueChange(option.value);
          }}
          contentClassName="w-full"
          triggerPlaceholder={readableLabel || allLabel}
        />
      )}
    </div>
  );
};

export default QueryStringComboBox;
