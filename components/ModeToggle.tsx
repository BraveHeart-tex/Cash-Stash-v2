"use client";

import * as React from "react";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "framer-motion";

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

  const itemVariants = {
    active: { scale: 1.1, opacity: 1 },
    inactive: { scale: 1, opacity: 0.8 },
  };

  return (
    <Tabs defaultValue={theme} value={theme} onValueChange={setTheme}>
      <TabsList className="border">
        {items.map((item, index) => (
          <motion.div
            key={item.id + index}
            variants={itemVariants}
            initial="inactive"
            animate={item.value === theme ? "active" : "inactive"}
            onClick={() => setTheme(item.value)}
          >
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
                    layoutId="active-colorTheme-pill"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 rounded-full"
                  />
                )}
                <span className="relative">{item.icon}</span>
              </div>
            </TabsTrigger>
          </motion.div>
        ))}
      </TabsList>
    </Tabs>
  );
}
