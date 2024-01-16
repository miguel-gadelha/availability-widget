"use client";

import { useRef } from "react";

interface Prop {
  className: string;
  type: string;
  placeholder?: string;
  label?: string;
  onInputChange?: (value: string) => void;
}

const Input = (props: Prop) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = `${props.label?.split(" ")[0].toLowerCase()}-input`;

  const handleInput = () => {
    if (inputRef.current && props.onInputChange) {
      props.onInputChange(inputRef.current.value);
    }
  };

  return (
    <div className={props.className}>
      {props.label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none block mb-2"
        >
          {props.label}
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        type={props.type}
        placeholder={props.placeholder}
        onInput={handleInput}
      />
    </div>
  );
};

export default Input;
