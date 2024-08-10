"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/stringUtils/cn";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { IconType } from "react-icons/lib";

export type PopoverActionOption = {
  icon: IconType;
  label: string;
  onClick: () => void;
  visible?: boolean;
};

type ActionPopoverProps = {
  heading: string;
  positionAbsolute?: boolean;
  options: PopoverActionOption[];
  trigger?: React.ReactNode;
  triggerClassName?: string;
};

const ActionPopover = ({
  options,
  trigger,
  heading,
  positionAbsolute,
  triggerClassName = "top-2 right-2 mb-2",
}: ActionPopoverProps) => {
  const renderTrigger = () => {
    if (trigger) {
      return trigger;
    }

    return (
      <div className="rounded-md p-2 transition-all hover:bg-secondary">
        <DotsHorizontalIcon className="h-5 w-5" />
      </div>
    );
  };

  const visibleOptions = options.filter((option) =>
    "visible" in option ? option.visible : true,
  );

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          positionAbsolute && "absolute outline-none focus:outline-none",
          triggerClassName,
        )}
      >
        {renderTrigger()}
      </PopoverTrigger>
      <PopoverContent align={"start"}>
        <h3 className="text-center font-semibold text-primary">{heading}</h3>
        <hr className="my-2" />
        <div className="grid grid-cols-1 gap-1">
          {visibleOptions.map((option) => (
            <Button
              key={option.label}
              variant={"ghost"}
              size={"icon"}
              aria-label={option.label}
              onClick={option.onClick}
              className="mr-2 flex w-full items-center justify-start gap-2 p-1"
            >
              {option.icon({ className: "h-5 w-5" })}
              <span className="text-[1.1em]">{option.label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ActionPopover;
