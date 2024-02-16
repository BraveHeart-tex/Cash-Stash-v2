"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./ui/button";
import { BsFilterLeft } from "react-icons/bs";
import { useQueryStates, parseAsString, UseQueryStatesKeysMap } from "nuqs";
import { areObjectsDeepEqual } from "@/lib/utils";
import { GenericFilterOption } from "@/actions/types";

interface IRouteFiltersPopoverProps<T extends Record<string, any>> {
  options: GenericFilterOption<T>[];
  queryKeys: Array<keyof T>;
}

const RouteFiltersPopover = <T extends Record<string, any>>({ options, queryKeys }: IRouteFiltersPopoverProps<T>) => {
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-max flex items-center gap-1 text-md mb-2">
          <BsFilterLeft />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h3 className="text-lg font-semibold mb-2 text-foreground">Filters</h3>
        <div className="p-1">
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <Button
                key={option.id}
                variant={areObjectsDeepEqual(key, option.data) ? "default" : "outline"}
                className="capitalize font-normal whitespace-nowrap flex items-center gap-1"
                onClick={() => {
                  setKey({ ...option.data });
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RouteFiltersPopover;
