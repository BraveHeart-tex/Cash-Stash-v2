import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { UseFormRegister } from "react-hook-form";
import FormError from "./FormError";
import { Label } from "./ui/label";

interface IFromSelectProps {
  defaultValue: string;
  onChange?: (value: string) => void;
  selectOptions: string[];
  defaultLabel: string;
  name: string;
  label: string;
  placeholder: string;
  register: UseFormRegister<any>;
  errors: {
    [name: string]: {
      message?: string;
    };
  };
  className?: string;
}

const FormSelect = ({
  name,
  label,
  register,
  errors,
  className,
  defaultValue,
  onChange,
  selectOptions,
}: IFromSelectProps) => {
  return (
    <>
      <div className="flex flex-col gap-1">
        <Label>{label}</Label>
        <Select
          defaultValue={defaultValue}
          onValueChange={(value: string) => {
            onChange && onChange(value);
          }}
          {...register(name)}
        >
          <SelectTrigger className={className}>
            <SelectValue placeholder="All Accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {selectOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors[name] && errors[name].message && (
          <FormError errorMessage={errors[name].message} />
        )}
      </div>
    </>
  );
};
export default FormSelect;
