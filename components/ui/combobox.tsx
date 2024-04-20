"use client";
import { forwardRef, useMemo, useState } from "react";
import { cn } from "@/lib/utils/stringUtils/cn";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FaCheck, FaSort } from "react-icons/fa";
import { ComboboxOption } from "@/server/types";
import { motion, AnimatePresence } from "framer-motion";

type ComboboxProps = {
  options: ComboboxOption[];
  // eslint-disable-next-line no-unused-vars
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
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOption, setSelectedOption] = useState<ComboboxOption | null>(
      defaultOption || null
    );

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

      return "Select an option";
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
                triggerClassName
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {renderTriggerPlaceholder()}
              <FaSort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className={cn("p-1 min-w-max", contentClassName)}
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
                  placeholder="Search"
                  className="h-9"
                />
                <CommandEmpty className="text-muted-foreground p-1 mt-2">
                  {emptyMessage || "No options were found for your search."}
                </CommandEmpty>
                <CommandList asChild>
                  <AnimatePresence>
                    <motion.ul className="mt-1 w-full min-h-[2.2rem] max-h-[150px] md:max-h-[200px] lg:max-h-[400px] overflow-auto">
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
                                "font-semibold text-primary"
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
                                  : "opacity-0"
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
  }
);
Combobox.displayName = "Combobox";

export default Combobox;
