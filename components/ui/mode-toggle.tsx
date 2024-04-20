"use client";

import Combobox from "./combobox";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/stringUtils/cn";
import { THEME_OPTIONS } from "@/lib/constants";

type ModeToggleProps = {
  triggerClassName?: string;
};

const ModeToggle = ({ triggerClassName }: ModeToggleProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const handleSelect = (value: string) => {
    setTheme(value);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Combobox
      triggerClassName={cn("w-full  whitespace-nowrap", triggerClassName)}
      defaultOption={THEME_OPTIONS.find((item) => item.value === theme)}
      options={THEME_OPTIONS}
      onSelect={(option) => handleSelect(option.value)}
    />
  );
};
export default ModeToggle;
