"use client";

import { useTheme } from "next-themes";
import type React from "react";
import { Toaster as Sonner } from "sonner";
import { useMediaQuery } from "usehooks-ts";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const SonnerToaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <Sonner
      theme={
        theme === "monokai-dark" ? "dark" : (theme as ToasterProps["theme"])
      }
      richColors
      closeButton
      className="toaster group"
      position={isMobile ? "top-center" : "bottom-right"}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export default SonnerToaster;
