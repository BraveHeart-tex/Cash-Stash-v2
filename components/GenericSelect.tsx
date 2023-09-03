import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { SelectOption } from "@/components/FormSelect";
import { cn } from "@/lib/utils";

interface GenericSelectProps {
  placeholder: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  selectLabel?: string;
  className?: string;
}

const GenericSelect = ({
  placeholder,
  options,
  onChange,
  selectLabel,
  className,
}: GenericSelectProps) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default GenericSelect;
