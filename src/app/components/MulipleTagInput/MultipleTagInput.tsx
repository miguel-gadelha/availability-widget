"use client";

import { useRef, useState } from "react";
import Tag from "../Tag/Tag";

interface Props {
  className: string;
  label?: string;
  placeholder?: string;
  onTagsChange?: (tags: string[]) => void; // Optional prop for the callback
}

const MultipleTagInput = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<string[]>([]);

  const handleTagDismiss = (index: number) => {
    setTags((tags) => {
      const newTags = [...tags];
      newTags.splice(index, 1);
      return newTags;
    });
  };

  const handleInput = () => {
    const inputValue = inputRef.current?.value;

    if (inputValue?.includes(",")) {
      if (inputValue.length > 1) {
        setTags((tags: string[]) => {
          return [...tags, inputValue.slice(0, -1)];
        });

        props.onTagsChange?.(tags);
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`multiple-tag-input ${props.className}`}>
      {props.label && (
        <label
          id="multiple-tag-label"
          className="text-sm font-medium leading-none block mb-2"
        >
          {props.label}
        </label>
      )}

      <div className="h-auto min-h-20 px-2 py-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <div
          className="items-start w-full flex flex-wrap"
          aria-labelledby="multiple-tag-label"
        >
          {tags.map((tag: string, i: number) => {
            return (
              <Tag
                className={`${i === 0 ? "mr-1" : "mx-1"} mb-1`}
                dismissable
                onDismiss={() => handleTagDismiss(i)}
                key={i}
              >
                {tag}
              </Tag>
            );
          })}
          <input
            className="ml-1 flex-grow min-w-36"
            ref={inputRef}
            type="text"
            onInput={handleInput}
            placeholder={tags.length === 0 ? props.placeholder : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default MultipleTagInput;
