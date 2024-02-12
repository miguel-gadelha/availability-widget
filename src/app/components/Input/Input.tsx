"use client";

import { Info } from "lucide-react";
import { useRef } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/Tooltip";

interface Prop {
  className: string;
  type: string;
  placeholder?: string;
  label?: string;
  value?: string;
  tooltip?: string;
  onInputChange?: (value: string) => void;
}

const Input = ({
  className,
  label,
  value,
  type,
  placeholder,
  tooltip,
  onInputChange,
}: Prop) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = `${label?.split(" ")[0].toLowerCase()}-input`;

  const handleInput = () => {
    if (inputRef.current && onInputChange) {
      onInputChange(inputRef.current.value);
    }
  };

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center mb-2">
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none block"
          >
            {label}
          </label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="ml-1">
                  <Info className="text-slate-500" width={16} height={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      <input
        value={value}
        ref={inputRef}
        id={id}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        type={type}
        placeholder={placeholder}
        onInput={handleInput}
      />
    </div>
  );
};

export default Input;
