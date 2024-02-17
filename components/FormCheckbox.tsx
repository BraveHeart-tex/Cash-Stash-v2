import { UseFormRegister } from "react-hook-form";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import FormError from "./FormError";
import { CheckedState } from "@radix-ui/react-checkbox";

interface IFormCheckboxProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: {
    [name: string]: {
      message?: string;
    };
  };
  className?: string;
  defaultChecked?: boolean;
  onChange?: (value: CheckedState) => void;
}

const FormCheckbox = ({
  name,
  label,
  register,
  errors,
  className,
  defaultChecked,
  onChange,
}: IFormCheckboxProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Checkbox
        defaultChecked={defaultChecked}
        id={name}
        {...register(name)}
        className={className}
        onCheckedChange={(e) => {
          onChange && onChange(e);
        }}
      />
      {errors[name] && errors[name].message && (
        <FormError errorMessage={errors[name].message} />
      )}
    </div>
  );
};
export default FormCheckbox;
