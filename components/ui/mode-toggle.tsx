"use client";

import Combobox, { ComboboxOption } from "@/components/ui/combobox";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/stringUtils/cn";
import { THEME_OPTIONS } from "@/lib/constants";
import { useTranslations } from "next-intl";

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
