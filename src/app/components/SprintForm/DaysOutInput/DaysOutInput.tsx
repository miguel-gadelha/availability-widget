"use client";

import { useState } from "react";

export type MemberVacations = { name: string; days: number };

interface Props {
  members: string[];
  label?: string;
  onInputChange: (vacations: MemberVacations[]) => void;
}

const DaysOutInput = (props: Props) => {
  const id = `${props.label?.split(" ")[0].toLowerCase()}-input`;

  const defaultState = props.members.map((name: string) => ({
    name,
    days: 0,
  }));

  const [daysOut, setDaysOut] = useState(defaultState);

  const handleInputChange = (name: string, value: string) => {
    setDaysOut((state: MemberVacations[]) => {
      const newState = [...state];
      const index = newState.findIndex((vacation) => vacation.name === name);

      if (index !== -1) {
        newState[index] = { name, days: Number(value) };
      }

      props.onInputChange(newState);

      return newState;
    });
  };

  return (
    <div className="days-out-input">
      {props.label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none block mb-2"
        >
          {props.label}
        </label>
      )}
      <div className="member-inputs mb-5">
        {props.members.map((member: string, i: number) => {
          return (
            <div
              className="input-item w-full flex justify-between items-center gap-3 font-normal text-base leading-none mb-2"
              key={`member-${i}`}
            >
              <span className="text-slate-600 text-sm not-italic font-medium leading-[100%]">
                {member}
              </span>
              <input
                className="rounded-md bg-white border border-gray-300 p-3 w-36"
                type="number"
                min={0}
                max={365}
                step={5}
                placeholder={"0"}
                onChange={(e) => handleInputChange(member, e.target.value)}
              ></input>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DaysOutInput;
