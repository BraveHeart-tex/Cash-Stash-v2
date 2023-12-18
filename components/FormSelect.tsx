import {
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Select,
  SelectValue,
} from "@/components/ui/select";
import { UseFormRegister } from "react-hook-form";
import FormError from "./FormError";
import { Label } from "./ui/label";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface IFromSelectProps {
  defaultValue: string;
  onChange?: (value: string) => void;
  selectOptions: SelectOption[];
  defaultLabel?: string;
  nameParam: string;
  label: string;
  placeholder: string;
  register: UseFormRegister<any>;
  errors: {
    [name: string]: {
      message?: string;
    };
  };
  className?: string;
  value?: string;
}

const FormSelect = ({
  nameParam,
  label,
  register,
  errors,
  className,
  defaultValue,
  value,
  onChange,
  selectOptions,
}: IFromSelectProps) => {
  const isError = errors[nameParam] && errors[nameParam].message;

  useEffect(() => {
    if (defaultValue && onChange) {
      onChange(defaultValue);
    }
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <Label className={cn(isError && "text-red-500")}>{label}</Label>
      <Select
        value={value}
        onValueChange={(value: string) => {
          onChange && onChange(value);
        }}
        {...register(nameParam)}
        name={nameParam}
        defaultValue={defaultValue}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Account Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isError && <FormError errorMessage={errors[nameParam].message} />}
    </div>
  );
};
export default FormSelect;
