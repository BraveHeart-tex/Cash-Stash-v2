"use client";
import { useTheme } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

type ThemeType = "dark" | "light" | "system" | undefined;
const SonnerToaster = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      richColors
      theme={theme as ThemeType}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto",
        },
      }}
    />
  );
};

export default SonnerToaster;
