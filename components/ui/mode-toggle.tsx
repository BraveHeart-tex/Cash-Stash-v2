"use client";

import Combobox, { type ComboboxOption } from "@/components/ui/combobox";
import { THEME_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils/stringUtils/cn";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ModeToggleProps = {
  triggerClassName?: string;
};

const ModeToggle = ({ triggerClassName }: ModeToggleProps) => {
  const t = useTranslations("ThemeOptions");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const handleSelect = (value: string) => {
    setTheme(value);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const mappedOptions: ComboboxOption[] = THEME_OPTIONS.map((item) => ({
    ...item,
    // biome-ignore lint/suspicious/noExplicitAny: It's intentional
    label: t(`${item.value}.label` as any),
  }));

  return (
    <Combobox
      triggerClassName={cn("w-full  whitespace-nowrap", triggerClassName)}
      defaultOption={mappedOptions.find((item) => item.value === theme)}
      options={mappedOptions}
      onSelect={(option) => handleSelect(option.value)}
    />
  );
};
export default ModeToggle;
