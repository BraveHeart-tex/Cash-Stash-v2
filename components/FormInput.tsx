import FormError from "@/components/FormError";
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface IFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: {
    [name: string]: {
      message?: string;
    };
  };
}

const FormInput = ({ name, placeholder, type, register, errors, label, className, ...props }: IFormInputProps) => {
  const isError = errors[name] && errors[name].message;
  return (
    <div className="flex flex-col gap-1">
      <Label className={cn(isError && "text-red-500")} htmlFor={name}>
        {label}
      </Label>
      <Input
        id={name}
        placeholder={placeholder}
        type={type}
        {...register(name)}
        {...props}
        className={className}
        data-testid={name}
        aria-invalid={isError ? "true" : "false"}
      />
      {isError && <FormError errorMessage={errors[name].message} />}
    </div>
  );
};

export default FormInput;
