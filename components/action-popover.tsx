"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Cross1Icon,
  DotsHorizontalIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface IActionPopoverProps {
  popoverHeading: string;
  onEditActionClick: () => void;
  onDeleteActionClick: () => void;
  align?: "start" | "center" | "end";
  isAbsolute?: boolean;
  placementClasses?: string;
}

const ActionPopover = ({
  onEditActionClick,
  onDeleteActionClick,
  popoverHeading,
  align = "start",
  isAbsolute = true,
  placementClasses = "top-2 right-2 mb-2",
}: IActionPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          isAbsolute ? "absolute focus:outline-none outline-none" : "",
          placementClasses
        )}
        aria-label={popoverHeading}
      >
        <div className="p-2 hover:bg-secondary transition-all rounded-md">
          <DotsHorizontalIcon className="h-5 w-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent align={align}>
        <h3 className="text-center font-semibold text-primary">
          {popoverHeading}
        </h3>
        <hr className="my-2" />
        <div className="grid grid-cols-1 gap-1">
          <div className="flex items-center">
            <Button
              variant={"ghost"}
              size={"icon"}
              aria-label="Edit user account"
              onClick={() => onEditActionClick()}
              className="mr-2 p-1 flex items-center gap-2 w-full justify-start"
            >
              <Pencil1Icon className="h-5 w-5" />
              <span className="text-[16px]">Edit</span>
            </Button>
          </div>
          <div className="flex items-center">
            <Button
              variant={"ghost"}
              size={"icon"}
              aria-label="Delete user account"
              onClick={() => onDeleteActionClick()}
              className="mr-2 p-1 flex items-center gap-2 w-full justify-start"
            >
              <Cross1Icon />
              <span className="text-[16px]">Delete</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default ActionPopover;
