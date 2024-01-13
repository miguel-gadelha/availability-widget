"use client";

import { FormEvent, useRef, useState } from "react";
import Tag from "../Tag/Tag";

const MultipleTagInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<string[]>([
    "Francisco Faria",
    "Pedro Postas",
  ]);

  const handleTagDismiss = (index: number) => {
    setTags((tags) => {
      const newTags = [...tags];
      newTags.splice(index, 1);
      return newTags;
    });
  };

  const handleInput = (e: FormEvent) => {
    const inputValue = inputRef.current?.value;

    if (inputValue?.includes(",")) {
      setTags((tags: string[]) => {
        return [...tags, inputValue.slice(0, -1)];
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex items-start flex-nowrap h-auto w-full min-h-20 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
      <div className="tag-holder flex">
        {tags.map((tag: string, i: number) => {
          return (
            <Tag
              className={i === 0 ? "mr-1" : "mx-1"}
              dismissable
              onDismiss={() => handleTagDismiss(i)}
              key={i}
            >
              {tag}
            </Tag>
          );
        })}
      </div>
      <input
        className="ml-1 w-full h-7"
        ref={inputRef}
        type="text"
        onInput={handleInput}
      />
    </div>
  );
};

export default MultipleTagInput;
