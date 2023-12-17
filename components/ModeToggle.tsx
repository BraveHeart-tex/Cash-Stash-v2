"use client";

import * as React from "react";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

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

  return (
    <Tabs defaultValue={theme}>
      <TabsList className="border">
        {items.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.value}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-white transition-all"
            onClick={() => setTheme(item.value)}
          >
            {item.icon}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
