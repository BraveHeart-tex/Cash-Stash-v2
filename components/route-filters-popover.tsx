"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BsFilterLeft } from "react-icons/bs";
import { useQueryStates, parseAsString, UseQueryStatesKeysMap } from "nuqs";
import { v4 as uuidv4 } from "uuid";
import { compareDeepObjectEquality } from "@/lib/utils/objectUtils/compareDeepObjectEquality";
import { useState } from "react";
import { useTranslations } from "next-intl";

export type GenericFilterOption<T> = {
  label: string;
  data: T;
  icon: React.JSX.Element;
};

type RouteFiltersPopoverProps<T extends Record<string, any>> = {
  options: GenericFilterOption<T>[];
  queryKeys: Array<keyof T>;
  triggerLabel?: string;
};

const RouteFiltersPopover = <T extends Record<string, any>>({
  options,
  queryKeys,
  triggerLabel,
}: RouteFiltersPopoverProps<T>) => {
  const t = useTranslations("Components.RouteFiltersPopover");
  const [isOpen, setIsOpen] = useState(false);
  const [activeQueryKey, setActiveQueryKey] = useQueryStates(
    {
      ...queryKeys.reduce((acc, key) => {
        acc[key] = parseAsString.withDefault("");
        return acc;
      }, {} as UseQueryStatesKeysMap<any>),
    },
    {
      shallow: false,
    }
  );

  const optionsWithIds = options.map((option) => ({
    ...option,
    id: uuidv4(),
  }));

  const handleClearFilters = () => {
    setActiveQueryKey(
      queryKeys.reduce((acc, key) => {
        // @ts-ignore
        acc[key] = "";
        return acc;
      }, {} as UseQueryStatesKeysMap<any>)
    );
    setIsOpen(false);
  };

  const hasActiveFilter = Object.keys(activeQueryKey).some(
    (key) => activeQueryKey[key] !== ""
  );

  const heading = t("heading");

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative flex w-max items-center gap-1 self-end"
        >
          <BsFilterLeft />
          {triggerLabel || heading}
          {hasActiveFilter && (
            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max">
        <h3 className="mb-2 text-lg font-semibold tracking-tight">{heading}</h3>
        <div className="p-1">
          <div className="flex flex-col gap-2">
            {optionsWithIds.map((option) => (
              <Button
                key={option.id}
                variant={
                  compareDeepObjectEquality(activeQueryKey, option.data)
                    ? "default"
                    : "outline"
                }
                className="flex items-center gap-1 whitespace-nowrap font-medium  capitalize"
                onClick={() => {
                  setActiveQueryKey({ ...option.data });
                }}
              >
                {option.icon}
                {option.label}
              </Button>
            ))}
          </div>
          <Button
            className="mt-2"
            variant="secondary"
            onClick={handleClearFilters}
          >
            {t("clearLabel")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RouteFiltersPopover;
