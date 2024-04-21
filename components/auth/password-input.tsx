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

function PasswordInput<T extends FieldValues>({
  field,
}: {
  field: ControllerRenderProps<T, any>;
}) {
  const capsLockActive = useCapsLock();
  return (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            type="password"
            placeholder="Enter your password"
            className="pr-10"
            {...field}
          />
          {capsLockActive && (
            <div className="absolute right-0 top-[2.5px] flex items-center justify-center rounded-full bg-primary p-2 text-primary-foreground">
              <BsCapslock />
            </div>
          )}
        </div>
      </FormControl>
      {capsLockActive && (
        <FormDescription className="font-semibold">
          Caps Lock is on
        </FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
export default PasswordInput;
