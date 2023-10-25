import FormError from "@/components/FormError";
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IFormInputProps {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  register: UseFormRegister<any>;
  errors: {
    [name: string]: {
      message?: string;
    };
  };
  className?: string;
}

const FormInput = ({
  name,
  placeholder,
  type,
  register,
  errors,
  label,
  className,
}: IFormInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        placeholder={placeholder}
        type={type}
        {...register(name)}
        className={className}
        data-testid={name}
      />
      {errors[name] && errors[name].message && (
        <FormError errorMessage={errors[name].message} />
      )}
    </div>
  );
};

export default FormInput;
