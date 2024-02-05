"use client";

import { stat } from "fs";
import { Circle } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const RadioButton = ({ className, checked, onChange }: Props) => {
  const [checkedRadio, setCheckedRadio] = useState(checked);

  useEffect(() => {
    setCheckedRadio(checked);
  }, [checked]);

  const handleClick = () => {
    onChange(!checkedRadio);
  };

  return (
    <button className={className} onClick={handleClick}>
      <div className="aspect-square h-4 w-4 rounded-full border border-slate-900 border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <div className="flex items-center justify-center h-full">
          {checked && (
            <Circle className="h-2.5 w-2.5 fill-current text-current" />
          )}
        </div>
      </div>
    </button>
  );
};

export default RadioButton;
