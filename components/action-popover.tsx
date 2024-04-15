"use client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconType } from "react-icons/lib";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";

type PopoverActionOption = {
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
      <div className="p-2 hover:bg-secondary transition-all rounded-md">
        <DotsHorizontalIcon className="h-5 w-5" />
      </div>
    );
  };

  const visibleOptions = options.filter((option) =>
    "visible" in option ? option.visible : true
  );

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          positionAbsolute && "absolute focus:outline-none outline-none",
          triggerClassName
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
              className="mr-2 p-1 flex items-center gap-2 w-full justify-start"
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
