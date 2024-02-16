"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { BsFilterLeft, BsSortDown, BsSortUp } from "react-icons/bs";
import { useQueryStates, parseAsString } from "nuqs";
import { areObjectsDeepEqual } from "@/lib/utils";

const RouteFiltersPopover = () => {
  const [key, setKey] = useQueryStates(
    {
      sortBy: parseAsString.withDefault(""),
      sortDirection: parseAsString.withDefault(""),
    },
    {
      shallow: false,
    }
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-max flex items-center gap-1 text-md mb-2"
        >
          <BsFilterLeft />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h3 className="text-lg font-semibold mb-2 text-foreground">Filters</h3>
        <div className="p-1">
          <div className="flex flex-col gap-2">
            <Button
              variant={
                areObjectsDeepEqual(key, {
                  sortBy: "balance",
                  sortDirection: "asc",
                })
                  ? "default"
                  : "outline"
              }
              className="capitalize font-normal whitespace-nowrap flex items-center gap-1"
              onClick={() =>
                setKey({
                  sortBy: "balance",
                  sortDirection: "asc",
                })
              }
            >
              <BsSortUp />
              Sort by balance ascending{" "}
            </Button>
            <Button
              variant={
                areObjectsDeepEqual(key, {
                  sortBy: "balance",
                  sortDirection: "desc",
                })
                  ? "default"
                  : "outline"
              }
              className="capitalize font-normal whitespace-nowrap flex items-center gap-1"
              onClick={() =>
                setKey({
                  sortBy: "balance",
                  sortDirection: "desc",
                })
              }
            >
              <BsSortDown />
              Sort by balance descending{" "}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RouteFiltersPopover;
