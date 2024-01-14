"use client";

import Link from "next/link";
import Input from "../Input/Input";
import MultipleTagInput from "../MulipleTagInput/MultipleTagInput";
import Card from "../ui/Card";
import Button from "../ui/button";
import { useState } from "react";
import Validator from "@/app/lib/validator";
import post from "axios";

const NAME_ERROR = "Your team needs a name with at least 3 characters. ";
const EMAIL_ERROR = "You need to provide a valid email. ";
const PASSWORD_ERROR =
  "Password must be at least 8 characters long, have at least one number, one lowercase and one uppercase letter. ";
const TEAM_ERROR = "Teams need to have at least one member. ";
const GENERIC_ERROR =
  "Something went wrong with your sign in. Please try again in a few seconds";

const TeamForm = () => {
  const [invalidForm, setInvalidForm] = useState(true);
  const [invalidMessage, setInvalidMessage] = useState("");
  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  const resetInvalid = () => {
    setInvalidForm(false);
    setInvalidMessage("");
  };

  const handleTeamNameChange = (value: string) => {
    resetInvalid();

    if (value.length >= 3) {
      setTeamName(value);
    }
  };

  const handleEmailChange = (value: string) => {
    resetInvalid();

    if (value.length >= 3) {
      setEmail(value);
    }
  };

  const handlePasswordChange = (value: string) => {
    resetInvalid();

    if (value.length >= 8) {
      setPassword(value);
    }
  };

  const handleTeamMembersChange = (tags: string[]) => {
    resetInvalid();
    setTeamMembers(tags);
  };

  const handleSubmit = () => {
    let formIsValid = true;

    if (teamName.length < 3) {
      formIsValid = false;
      setInvalidMessage((message: string) => {
        return message + NAME_ERROR;
      });
    }

    if (!Validator.email(email)) {
      formIsValid = false;
      setInvalidMessage((message: string) => {
        return message + EMAIL_ERROR;
      });
    }

    if (!Validator.password(password)) {
      formIsValid = false;
      setInvalidMessage((message: string) => {
        return message + PASSWORD_ERROR;
      });
    }

    if (teamMembers.length < 1) {
      formIsValid = false;
      setInvalidMessage((message: string) => {
        return message + TEAM_ERROR;
      });
    }

    if (!formIsValid) {
      return;
    }

    const request_body = {
      name: teamName,
      email,
      password,
      teamMembers,
    };

    console.log(request_body);

    post({ url: "/api/team/create", data: request_body })
      .then((respose) => {
        if (respose.status !== 200) {
          setInvalidMessage(GENERIC_ERROR);
          return;
        }

        // redirect to login
      })
      .catch(() => {
        setInvalidMessage(GENERIC_ERROR);
      });
  };
  return (
    <Card className="team-form w-96">
      <h3 className="text-slate-900 text-lg leading-7 font-bold mb-2">
        Sign up
      </h3>
      <p className="text-sm leading-5 text-slate-500 mb-5">
        Add your team details. This information can be changed later on
      </p>

      <Input
        className="mb-4"
        type="text"
        placeholder="Add your team name"
        label="Team Name"
        onInputChange={handleTeamNameChange}
      ></Input>
      <Input
        className="mb-4"
        type="email"
        placeholder="Add your team email"
        label="Email"
        onInputChange={handleEmailChange}
      ></Input>
      <Input
        className="mb-4"
        type="password"
        placeholder="Add your password"
        label="Password"
        onInputChange={handlePasswordChange}
      ></Input>
      <MultipleTagInput
        label="Team Members"
        placeholder="Insert names separated by a comma ( , )"
        className="mb-4"
        onTagsChange={handleTeamMembersChange}
      ></MultipleTagInput>

      <Button
        type="button"
        className="w-full"
        onClick={handleSubmit}
        disabled={invalidForm}
      >
        Sign Up
      </Button>

      {invalidMessage && (
        <div className="error p-2 text-red-600">{invalidMessage}</div>
      )}

      <p className="w-full text-center mt-5 text-sm font-normal leading-5 text-slate-600">
        If you already have an account{" "}
        <Link className="font-bold underline" href={"/login"}>
          Log in
        </Link>
      </p>
    </Card>
  );
};

export default TeamForm;
