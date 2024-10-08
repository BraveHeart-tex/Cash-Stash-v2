"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/stringUtils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type React from "react";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { FaCheck, FaSort } from "react-icons/fa";
import type { IconType } from "react-icons/lib";
import { useMediaQuery } from "usehooks-ts";

export type ComboboxOption = {
  icon?: IconType;
  label: string | number;
  value: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  onSelect: (option: ComboboxOption) => void;
  triggerClassName?: string;
  contentClassName?: string;
  emptyMessage?: string;
  defaultOption?: ComboboxOption;
  trigger?: React.ReactNode;
  triggerPlaceholder?: string;
};

const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      onSelect,
      triggerClassName,
      contentClassName,
      emptyMessage,
      defaultOption,
      trigger,
      triggerPlaceholder,
    },
    ref,
  ) => {
    const t = useTranslations("Components.Combobox");
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOption, setSelectedOption] = useState<ComboboxOption | null>(
      defaultOption || null,
    );

    useEffect(() => {
      if (defaultOption) {
        setSelectedOption(defaultOption);
      }
    }, [defaultOption]);

    const handleOptionClick = (option: ComboboxOption) => {
      setSelectedOption(option);
      onSelect(option);
      setIsOpen(false);
    };

    const filteredOptions = useMemo(() => {
      const newOptions = options.filter((option) => {
        const normalizedQuery = searchQuery.toLowerCase();
        const normalizedLabel = option.label.toString().toLowerCase();
        const normalizedValue = option.value.toString().toLowerCase();

        return (
          normalizedLabel.includes(normalizedQuery) ||
          normalizedValue.includes(normalizedQuery)
        );
      });

      return newOptions;
    }, [options, searchQuery]);

    const renderTriggerPlaceholder = () => {
      if (selectedOption) {
        return (
          <span className="flex items-center gap-1">
            {selectedOption?.icon ? (
              <selectedOption.icon className="h-4 w-4" />
            ) : null}
            {selectedOption?.label}
          </span>
        );
      }

      if (triggerPlaceholder) {
        return triggerPlaceholder;
      }

      return t("selectAnOption");
    };

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen} modal>
        <PopoverTrigger asChild ref={ref} className="w-full">
          {trigger ? (
            trigger
          ) : (
            <Button
              variant="outline"
              role="combobox"
              id="combobox-trigger"
              aria-expanded={isOpen}
              className={cn(
                "w-full justify-between truncate",
                triggerClassName,
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {renderTriggerPlaceholder()}
              <FaSort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          onOpenAutoFocus={(event) => {
            if (isMobile) event.preventDefault();
          }}
          align="start"
          className={cn("min-w-max p-1", contentClassName)}
        >
          <Command shouldFilter={false} className="w-full">
            <AnimatePresence>
              <motion.article
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <CommandInput
                  value={searchQuery}
                  onValueChange={(value) => setSearchQuery(value)}
                  placeholder={t("searchPlaceholder")}
                  className="h-9"
                />
                <CommandEmpty className="mt-2 p-1 text-muted-foreground">
                  {emptyMessage || t("emptyMessage")}
                </CommandEmpty>
                <CommandList asChild>
                  <AnimatePresence>
                    <motion.ul className="mt-1 max-h-[150px] min-h-[2.2rem] w-full overflow-auto md:max-h-[200px] lg:max-h-[400px]">
                      {filteredOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => {
                            handleOptionClick(option);
                          }}
                          asChild
                        >
                          <motion.li
                            id={`option-${option.value}`}
                            whileTap={{ scale: 0.97 }}
                            className={cn(
                              selectedOption?.value === option.value &&
                                "font-semibold text-primary",
                            )}
                          >
                            <span className="flex items-center gap-2">
                              {option.icon ? (
                                <option.icon className="h-4 w-4" />
                              ) : null}
                              {option.label}
                            </span>
                            <FaCheck
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedOption?.value === option.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </motion.li>
                        </CommandItem>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                </CommandList>
              </motion.article>
            </AnimatePresence>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
Combobox.displayName = "Combobox";

export default Combobox;
