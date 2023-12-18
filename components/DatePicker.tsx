"use client";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormRegister } from "react-hook-form";
import FormError from "./FormError";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";

interface IDatePickerProps {
  name: string;
  label: string;
  placeholder: string;
  register: UseFormRegister<any>;
  errors: {
    [name: string]: {
      message?: string;
    };
  };
  className?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
}

export default function DatePicker({
  name,
  placeholder,
  register,
  errors,
  label,
  className,
  defaultValue,
  onChange,
}: IDatePickerProps) {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (defaultValue) {
      setDate(new Date(defaultValue));
    }
  }, [defaultValue]);

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0")}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              if (date) {
                setDate(date);
                onChange && onChange(date?.toISOString()!);
              }
            }}
            initialFocus
            className="w-full"
            {...register(name)}
          />
        </PopoverContent>
      </Popover>
      {errors[name] && errors[name].message && (
        <FormError errorMessage={errors[name].message} />
      )}
    </div>
  );
}
