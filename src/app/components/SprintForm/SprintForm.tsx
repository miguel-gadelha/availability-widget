"use client";

import Input from "../Input/Input";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DaysOutInput, { MemberVacations } from "./DaysOutInput/DaysOutInput";
import { TeamContext } from "@/app/context/TeamContext";

const NAME_ERROR =
  "You must provide a unique name with more than 3 characters. ";
const LENGTH_ERROR = "Sprint length must be at least 1 day. ";
const GENERIC_ERROR =
  "Something went wrong creating your sprint. Please try again in a few seconds. ";
const DAYS_OUT_ERROR =
  "The team members cannot be out for more than the length of the sprint. ";

interface Props {
  onSubmit: () => void;
}

const SprintForm = (props: Props) => {
  const [invalidMessage, setInvalidMessage] = useState("");
  const [name, setName] = useState("");
  const [length, setLength] = useState<number | null>(null);
  const [members, setMembers] = useState<MemberVacations[]>([]);
  const [invalidName, setInvalidName] = useState(true);
  const [invalidLength, setInvalidLength] = useState(true);
  const [invalidDaysOut, setInvalidDaysOut] = useState(true);

  const router = useRouter();
  const context = useContext(TeamContext);

  if (!context) {
    return;
  }

  const handleNameChange = (value: string) => {
    setInvalidMessage("");

    if (value.length < 3) {
      setInvalidName(true);
    } else {
      setInvalidName(false);
      setName(value);
    }
  };

  const handleLengthChange = (value: string) => {
    setInvalidMessage("");

    if (Number(value) < 1) {
      setInvalidLength(true);
    } else {
      setInvalidLength(false);
      setLength(Number(value));
    }
  };

  const handleDaysOutChange = (value: MemberVacations[]) => {
    setInvalidMessage("");

    if (
      length &&
      value.some((memberVacation: MemberVacations) => {
        return memberVacation.days > length;
      })
    ) {
      setInvalidDaysOut(true);
    }

    setMembers(value);
  };

  const handleSubmit = () => {
    if (invalidName) {
      setInvalidMessage((message: string) => message + NAME_ERROR);
    }
    if (invalidLength) {
      setInvalidMessage((message: string) => message + LENGTH_ERROR);
    }

    if (invalidDaysOut) {
      setInvalidMessage((message: string) => message + DAYS_OUT_ERROR);
    }

    if (invalidName || invalidLength || invalidDaysOut) {
      return;
    }

    const request_body = {
      name,
      length,
      members,
    };

    axios
      .post("/api/sprint/create", request_body, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (response.status !== 201) {
          console.error(response);
          setInvalidMessage(GENERIC_ERROR);
          return;
        }

        props.onSubmit();
      })
      .catch((error) => {
        console.error(error);
        setInvalidMessage(GENERIC_ERROR);
      });
  };

  return (
    <Card className="team-form w-[384px]">
      <h3 className="text-slate-900 text-lg leading-7 font-bold mb-5">
        New Sprint
      </h3>

      <Input
        className={`mb-4 ${invalidName ? "border-red-500" : ""}`}
        type="text"
        placeholder="Add your sprint name"
        label="Sprint Name"
        onInputChange={handleNameChange}
      ></Input>
      <Input
        className={`mb-4 ${invalidLength ? "border-red-500" : ""}`}
        type="number"
        placeholder="Add the length of your sprint"
        label="Sprint Length"
        onInputChange={handleLengthChange}
      ></Input>

      <DaysOutInput
        members={context.teamMembers as string[]}
        label="Team Member's Days Out"
        onInputChange={handleDaysOutChange}
      ></DaysOutInput>

      <Button type="button" className="w-full" onClick={handleSubmit}>
        Continue
      </Button>

      {invalidMessage && (
        <div className="error p-2 text-red-600">{invalidMessage}</div>
      )}
    </Card>
  );
};

export default SprintForm;
