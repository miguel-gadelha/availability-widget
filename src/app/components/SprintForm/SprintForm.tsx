"use client";

import Input from "../Input/Input";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useState } from "react";
import DaysOutInput from "./DaysOutInput/DaysOutInput";
import { MemberVacations, Sprint } from "@/types";

interface Props {
  sprint: Sprint;
  isLoading?: boolean;
  title?: string;
  submitTitle?: string;
  onInputChange: (sprint: Sprint) => void;
  onComplete?: (sprint: Sprint) => void;
  onSubmit?: () => void;
}

const SprintForm = ({
  sprint,
  title = "New Sprint",
  submitTitle = "Save",
  isLoading,
  onInputChange,
  onSubmit,
}: Props) => {
  const noErrors = {
    name: "",
    length: "",
    members: "",
  };

  const [errors, setErrors] = useState(noErrors);

  const handleNameChange = (name: string) => {
    setErrors(noErrors);
    onInputChange({ ...sprint, name: name });
  };

  const handleLengthChange = (length: string) => {
    setErrors(noErrors);
    onInputChange({ ...sprint, length: Number(length) });
  };

  const handleMembersChange = (members: MemberVacations[]) => {
    setErrors(noErrors);
    onInputChange({ ...sprint, members: members });
  };

  const handleSubmit = () => {
    if (sprint.name.length < 3) {
      setErrors((errors) => {
        return {
          ...errors,
          name: "You must provide a unique name with more than 3 characters",
        };
      });
    }

    if (sprint.length < 1) {
      setErrors((errors) => {
        return { ...errors, length: "Sprint length must be at least 1 day" };
      });
    }

    if (
      length &&
      sprint.members.some((memberVacation: MemberVacations) => {
        return Number(memberVacation.days) > length;
      })
    ) {
      setErrors((errors) => {
        return {
          ...errors,
          members:
            "The team members cannot be out for more than the length of the sprint",
        };
      });
    }

    if (
      length &&
      sprint.members.some((memberVacation: MemberVacations) => {
        return !memberVacation.days;
      })
    ) {
      setErrors((errors) => {
        return {
          ...errors,
          members: "You have to fill in the days out of each team member",
        };
      });
    }

    if (errors.name || errors.length || errors.members) {
      return;
    }

    onSubmit?.();
  };

  const renderErrorMessage = () => {
    let message;

    for (let error in errors) {
      message = `${message} ${error}, `;
    }

    return message;
  };
  return (
    <Card className="team-form w-[384px]">
      <h3 className="text-slate-900 text-lg leading-7 font-bold mb-5">
        {title}
      </h3>

      <Input
        className={`mb-4 ${errors.name ? "border-red-500" : ""}`}
        type="text"
        placeholder="Add your sprint name"
        label="Sprint Name"
        value={decodeURI(sprint.name)}
        onInputChange={handleNameChange}
      ></Input>
      <Input
        className={`mb-4 ${errors.length ? "border-red-500" : ""}`}
        type="number"
        placeholder="Add the length of your sprint"
        label="Sprint Length"
        value={String(sprint.length)}
        onInputChange={handleLengthChange}
      ></Input>

      <DaysOutInput
        label="Team Member's Days Out"
        daysOut={sprint.members}
        onInputChange={handleMembersChange}
      ></DaysOutInput>

      <Button
        type="button"
        className={`w-full flex items-center justify-center`}
        onClick={handleSubmit}
        isLoading={isLoading}
      >
        {submitTitle}
      </Button>

      {(errors.name || errors.length || errors.members) && (
        <div className="error p-2 text-red-600">{renderErrorMessage()}</div>
      )}
    </Card>
  );
};

export default SprintForm;
