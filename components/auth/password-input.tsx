"use client";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BsCapslock } from "react-icons/bs";
import useCapsLock from "@/components/hooks/useCapsLock";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

type PasswordInputProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, any>;
  passwordFieldLabel: string;
  passwordFieldPlaceholder: string;
  passwordFieldCapsLockMessage: string;
};

function PasswordInput<T extends FieldValues>({
  field,
  passwordFieldLabel,
  passwordFieldPlaceholder,
  passwordFieldCapsLockMessage,
}: PasswordInputProps<T>) {
  const capsLockActive = useCapsLock();
  return (
    <FormItem>
      <FormLabel>{passwordFieldLabel}</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            type="password"
            placeholder={passwordFieldPlaceholder}
            className="pr-10"
            {...field}
          />
          {capsLockActive && (
            <div className="absolute right-0 top-[2.5px] flex items-center justify-center rounded-md bg-primary p-2 text-primary-foreground">
              <BsCapslock />
            </div>
          )}
        </div>
      </FormControl>
      {capsLockActive && (
        <FormDescription className="font-semibold">
          {passwordFieldCapsLockMessage}
        </FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
export default PasswordInput;
