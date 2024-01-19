"use client";

import Link from "next/link";
import Input from "../Input/Input";
import MultipleTagInput from "../MulipleTagInput/MultipleTagInput";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useState } from "react";
import Validator from "@/app/lib/utils/validator";
import axios from "axios";
import { useRouter } from "next/navigation";

const NAME_ERROR = "Your team needs a name with at least 3 characters. ";
const EMAIL_ERROR = "You need to provide a valid email. ";
const PASSWORD_ERROR =
  "Password must be at least 8 characters long, have at least one number, one lowercase and one uppercase letter. ";
const TEAM_ERROR = "Teams need to have at least one member. ";
const GENERIC_ERROR =
  "Something went wrong with your sign in. Please try again in a few seconds";

const TeamForm = () => {
  const [invalidMessage, setInvalidMessage] = useState("");

  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  const [invalidName, setInvalidName] = useState(true);
  const [invalidEmail, setInvalidEmail] = useState(true);
  const [invalidPassword, setInvalidPassword] = useState(true);
  const [invalidTeam, setInvalidTeam] = useState(true);

  const router = useRouter();

  const handleTeamNameChange = (value: string) => {
    setInvalidMessage("");

    if (value.length < 3) {
      setInvalidName(true);
    } else {
      setInvalidName(false);
      setTeamName(value);
    }
  };

  const handleEmailChange = (value: string) => {
    setInvalidMessage("");

    if (!Validator.email(value)) {
      setInvalidEmail(true);
    } else {
      setInvalidEmail(false);
      setEmail(value);
    }
  };

  const handlePasswordChange = (value: string) => {
    setInvalidMessage("");

    if (!Validator.password(value)) {
      setInvalidPassword(true);
    } else {
      setInvalidPassword(false);
      setPassword(value);
    }
  };

  const handleTeamMembersChange = (tags: string[]) => {
    setInvalidMessage("");

    if (tags.length < 1) {
      setInvalidTeam(true);
    } else {
      setInvalidTeam(false);
      setTeamMembers(tags);
    }
  };

  const handleSubmit = () => {
    if (invalidName) {
      setInvalidMessage((message: string) => message + NAME_ERROR);
    }
    if (invalidEmail) {
      setInvalidMessage((message: string) => message + EMAIL_ERROR);
    }
    if (invalidPassword) {
      setInvalidMessage((message: string) => message + PASSWORD_ERROR);
    }
    if (invalidTeam) {
      setInvalidMessage((message: string) => message + TEAM_ERROR);
    }

    if (
      invalidEmail ||
      invalidMessage ||
      invalidName ||
      invalidPassword ||
      invalidPassword ||
      invalidTeam
    ) {
      return;
    }

    const request_body = {
      name: teamName,
      email,
      password,
      teamMembers,
    };

    axios
      .post("/api/team/create", request_body, {
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

        router.push("/login");
      })
      .catch((error) => {
        console.error(error);
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
        className={`mb-4 ${invalidName ? "border-red-500" : ""}`}
        type="text"
        placeholder="Add your team name"
        label="Team Name"
        onInputChange={handleTeamNameChange}
      ></Input>
      <Input
        className={`mb-4 ${invalidEmail ? "border-red-500" : ""}`}
        type="email"
        placeholder="Add your team email"
        label="Email"
        onInputChange={handleEmailChange}
      ></Input>
      <Input
        className={`mb-4 ${invalidPassword ? "border-red-500" : ""}`}
        type="password"
        placeholder="Add your password"
        label="Password"
        onInputChange={handlePasswordChange}
      ></Input>
      <MultipleTagInput
        label="Team Members"
        placeholder="Insert names separated by a comma ( , )"
        className={`mb-4 ${invalidTeam ? "border-red-500" : ""}`}
        onTagsChange={handleTeamMembersChange}
      ></MultipleTagInput>

      <Button type="button" className="w-full" onClick={handleSubmit}>
        Sign Up
      </Button>

      {invalidMessage && (
        <div className="error p-2 text-red-600">{invalidMessage}</div>
      )}

      <p className="w-full text-center mt-5 text-sm font-normal leading-5 text-slate-600">
        If you already have an account{" "}
        <Link className="font-bold underline" href={"/auth/login"}>
          Log in
        </Link>
      </p>
    </Card>
  );
};

export default TeamForm;
