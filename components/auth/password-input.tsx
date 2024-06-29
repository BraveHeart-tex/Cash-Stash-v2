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
import { useTranslations } from "next-intl";
import { useState } from "react";

type PasswordInputProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, any>;
};

function PasswordInput<T extends FieldValues>({
  field,
}: PasswordInputProps<T>) {
  const [focused, setFocused] = useState(false);
  const capsLockActive = useCapsLock();
  const t = useTranslations("Components.PasswordInput");

  const shouldShowCapsLockIndicator = focused && capsLockActive;

  return (
    <FormItem>
      <FormLabel>{t("passwordFieldLabel")}</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            onFocus={() => setFocused(true)}
            type="password"
            placeholder={t("passwordFieldPlaceholder")}
            className="pr-10"
            {...field}
            onBlur={() => {
              field?.onBlur();
              setFocused(false);
            }}
          />
          {shouldShowCapsLockIndicator && (
            <div className="absolute right-0 top-[2.5px] flex items-center justify-center rounded-md bg-primary p-2 text-primary-foreground">
              <BsCapslock />
            </div>
          )}
        </div>
      </FormControl>
      {shouldShowCapsLockIndicator && (
        <FormDescription className="font-semibold">
          {t("passwordFieldCapsLockMessage")}
        </FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}

export default PasswordInput;
