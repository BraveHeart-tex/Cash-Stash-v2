"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export function ModeSwitch() {
  const { setTheme } = useTheme();
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="color-mode"
        checked={useTheme().theme === "dark"}
        onCheckedChange={(value: string) => {
          if (value) {
            setTheme("dark");
          } else {
            setTheme("light");
          }
        }}
      />
      <Label htmlFor="color-mode">
        {`Toggle ${useTheme().theme === "dark" ? "light" : "dark"} mode`}
      </Label>
    </div>
  );
}
