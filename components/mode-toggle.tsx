"use client";

import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const items = [
  {
    id: 1,
    icon: <SunIcon className="h-[1.2rem] w-[1.2rem]" />,
    value: "light",
  },
  {
    id: 2,
    icon: <MoonIcon className="h-[1.2rem] w-[1.2rem] transition-all" />,
    value: "dark",
  },
  {
    id: 3,
    icon: <DesktopIcon className="h-[1.2rem] w-[1.2rem]" />,
    value: "system",
  },
];

export function ModeToggle({ layoutId }: { layoutId: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Tabs defaultValue={theme} value={theme} onValueChange={setTheme}>
      <TabsList className="border">
        {items.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.value}
            data-state={
              item.value === (theme ?? "light") ? "active" : "inactive"
            }
            className="relative data-[state=active]:text-white"
          >
            <div>
              {item.value === (theme ?? "light") && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 rounded-full"
                />
              )}
              <span className="relative">{item.icon}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
