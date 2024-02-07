"use client";

import { MemberVacations } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface Props {
  daysOut: MemberVacations[];
  members: string[];
  label?: string;
  onInputChange: (vacations: MemberVacations[]) => void;
}

const DaysOutInput = ({ daysOut, members, label, onInputChange }: Props) => {
  const id = `${label?.split(" ")[0].toLowerCase()}-input`;

  const getEmptyState = useCallback(() => {
    return members.map((name: string) => ({
      name,
      days: "",
    })) as MemberVacations[];
  }, [members]);

  useEffect(() => {
    if (daysOut.length === 0) {
      onInputChange(getEmptyState());
    }
  }, [daysOut, onInputChange, getEmptyState]);

  const handleInputChange = (name: string, memberDaysOut: number) => {
    const newState = [...daysOut];
    const index = newState.findIndex((vacation) => vacation.name === name);

    if (index !== -1) {
      newState[index] = { name, days: memberDaysOut };
    }

    onInputChange(newState);

    return newState;
  };

  return (
    <div className="days-out-input">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none block mb-2"
        >
          {label}
        </label>
      )}
      <div className="member-inputs mb-5">
        {daysOut &&
          daysOut.map((member: MemberVacations, i: number) => {
            return (
              <div
                className="input-item w-full flex justify-between items-center gap-3 font-normal text-base leading-none mb-2"
                key={`member-${i}`}
              >
                <span className="text-slate-600 text-sm not-italic font-medium leading-[100%]">
                  {member.name}
                </span>
                <input
                  className="rounded-md bg-white border border-gray-300 p-3 w-36"
                  type="number"
                  min={0}
                  max={365}
                  step={5}
                  placeholder={"0"}
                  onInput={(e) =>
                    handleInputChange(
                      member.name,
                      Number((e.target as HTMLInputElement).value)
                    )
                  }
                ></input>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DaysOutInput;
