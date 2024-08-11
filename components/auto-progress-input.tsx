"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/stringUtils/cn";
import {
  type ClipboardEvent,
  type HTMLInputTypeAttribute,
  type KeyboardEvent,
  type RefObject,
  useRef,
  useState,
} from "react";

type AutoProgressInputProps = {
  length: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  loading?: boolean;
};

const AutoProgressInput = ({
  length,
  onChange,
  type = "text",
  loading,
}: AutoProgressInputProps) => {
  const [values, setValues] = useState(new Array(length).fill(""));
  const refs: RefObject<HTMLInputElement>[] = Array.from({ length }, () =>
    // biome-ignore lint/correctness/useHookAtTopLevel: This is intended
    useRef<HTMLInputElement>(null),
  );

  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;

    // Move focus to the next input if value is not empty and index is not the last
    if (value && index < length - 1) {
      refs[index + 1]?.current?.focus();
    }

    setValues(newValues);
    onChange(newValues.join(""));
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    // Move focus to the previous input if backspace is pressed and index is not the first
    if (event.key === "Backspace" && !values[index] && index > 0) {
      refs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text/plain");
    const pastedValues = pastedData.split("").slice(0, length);
    if (pastedValues.length < length) {
      pastedValues.push(...new Array(length - pastedValues.length).fill(""));
    }

    setValues(pastedValues);
    onChange(pastedValues.join(""));
  };

  return (
    <div className="flex items-center">
      {values.map((value, index) => (
        <>
          <Label
            htmlFor={`auto-progress-input-${index + 1}`}
            // biome-ignore lint/suspicious/noArrayIndexKey: This is fine
            key={index}
            className="sr-only"
          >
            Input {index + 1}
          </Label>
          <Input
            id={`auto-progress-input-${index + 1}`}
            className={cn(
              "mr-[0.5em] w-[3em] bg-background text-center",
              loading && "animate-pulse opacity-50",
            )}
            autoComplete="off"
            aria-label={`Auto progress input field ${index + 1}`}
            // biome-ignore lint/suspicious/noArrayIndexKey: This is fine
            key={index + 1}
            ref={refs[index]}
            type={type}
            disabled={loading}
            maxLength={1}
            onPaste={handlePaste}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        </>
      ))}
    </div>
  );
};

export default AutoProgressInput;
