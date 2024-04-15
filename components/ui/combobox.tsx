"use client";
import { useMemo, useState } from "react";
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
import { IComboboxOption } from "@/server/types";
import { motion, AnimatePresence } from "framer-motion";

interface IComboboxProps {
  options: IComboboxOption[];
  // eslint-disable-next-line no-unused-vars
  onSelect: (option: IComboboxOption) => void;
  triggerClassName?: string;
  contentClassName?: string;
  emptyMessage?: string;
  defaultOption?: IComboboxOption;
  trigger?: React.ReactNode;
}

const Combobox = ({
  options,
  onSelect,
  triggerClassName,
  contentClassName,
  emptyMessage,
  defaultOption,
  trigger,
}: IComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState<IComboboxOption | null>(
    defaultOption || null
  );

  const handleOptionClick = (option: IComboboxOption) => {
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="outline"
            role="combobox"
            id="combobox-trigger"
            aria-expanded={isOpen}
            className={cn("w-full justify-between", triggerClassName)}
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedOption?.label || "Select an option"}
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
              <CommandEmpty>
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
                          {option.label}
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
};

export default Combobox;
