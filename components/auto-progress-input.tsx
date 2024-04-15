import React, {
  useState,
  useRef,
  RefObject,
  KeyboardEvent,
  ClipboardEvent,
  HTMLInputTypeAttribute,
  useEffect,
} from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/stringUtils/cn";

type AutoProgressInputProps = {
  length: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  loading?: boolean;
  shouldFocusFirstInput?: boolean;
};

const AutoProgressInput = ({
  length,
  onChange,
  type = "text",
  loading,
  shouldFocusFirstInput = false,
}: AutoProgressInputProps) => {
  const [values, setValues] = useState(new Array(length).fill(""));
  const refs: RefObject<HTMLInputElement>[] = Array.from({ length }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRef<HTMLInputElement>(null)
  );

  useEffect(() => {
    if (shouldFocusFirstInput) {
      refs[0]?.current?.focus();
    }
  }, [shouldFocusFirstInput, refs]);

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
    event: KeyboardEvent<HTMLInputElement>
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
        <Input
          className={cn(
            "w-[3em] mr-[0.5em] text-center bg-background",
            loading && "opacity-50 animate-pulse"
          )}
          key={index}
          ref={refs[index]}
          type={type}
          disabled={loading}
          maxLength={1}
          onPaste={handlePaste}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
};

export default AutoProgressInput;
