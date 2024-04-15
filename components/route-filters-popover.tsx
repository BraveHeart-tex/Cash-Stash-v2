"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BsFilterLeft } from "react-icons/bs";
import { useQueryStates, parseAsString, UseQueryStatesKeysMap } from "nuqs";

import { GenericFilterOption } from "@/server/types";
import { v4 as uuidv4 } from "uuid";
import { areObjectsDeepEqual } from "@/lib/utils/objectUtils/deepEqual";
import { useState } from "react";

interface IRouteFiltersPopoverProps<T extends Record<string, any>> {
  options: GenericFilterOption<T>[];
  queryKeys: Array<keyof T>;
  triggerLabel?: string;
}

const RouteFiltersPopover = <T extends Record<string, any>>({
  options,
  queryKeys,
  triggerLabel,
}: IRouteFiltersPopoverProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useQueryStates(
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
    setKey(
      queryKeys.reduce((acc, key) => {
        // @ts-ignore
        acc[key] = "";
        return acc;
      }, {} as UseQueryStatesKeysMap<any>)
    );
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-max flex items-center gap-1 mb-2"
        >
          <BsFilterLeft />
          {triggerLabel || "Filters"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Filters</h3>
        <div className="p-1">
          <div className="flex flex-col gap-2">
            {optionsWithIds.map((option) => (
              <Button
                key={option.id}
                variant={
                  areObjectsDeepEqual(key, option.data) ? "default" : "outline"
                }
                className="capitalize font-normal whitespace-nowrap flex items-center gap-1"
                onClick={() => {
                  setKey({ ...option.data });
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
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RouteFiltersPopover;
