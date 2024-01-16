"use client";

import Link from "next/link";
import Input from "../Input/Input";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useState } from "react";
import Validator from "@/app/lib/validator";
import axios from "axios";
import { useRouter } from "next/navigation";

const EMAIL_ERROR = "You need to provide a valid email. ";
const PASSWORD_ERROR =
  "Password must be at least 8 characters long, have at least one number, one lowercase and one uppercase letter. ";
const GENERIC_ERROR =
  "Invalid login. Please make sure you fill in the correct credentials";

const LoginForm = () => {
  const [invalidMessage, setInvalidMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [invalidEmail, setInvalidEmail] = useState(true);
  const [invalidPassword, setInvalidPassword] = useState(true);

  const router = useRouter();

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

  const handleSubmit = () => {
    if (invalidEmail) {
      setInvalidMessage((message: string) => message + EMAIL_ERROR);
    }
    if (invalidPassword) {
      setInvalidMessage((message: string) => message + PASSWORD_ERROR);
    }

    if (invalidEmail || invalidMessage || invalidPassword || invalidPassword) {
      return;
    }

    const request_body = {
      email,
      password,
    };

    axios
      .post("/api/login", request_body, {
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

        router.push("/manage");
      })
      .catch((error) => {
        console.error(error);
        setInvalidMessage(GENERIC_ERROR);
      });
  };

  return (
    <Card className="team-form w-96">
      <h3 className="text-slate-900 text-lg leading-7 font-bold mb-5">
        Welcome Back
      </h3>

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

      <Button type="button" className="w-full" onClick={handleSubmit}>
        Login
      </Button>

      {invalidMessage && (
        <div className="error p-2 text-red-600">{invalidMessage}</div>
      )}

      <p className="w-full text-center mt-5 text-sm font-normal leading-5 text-slate-600">
        Don&apos;t have an account?{" "}
        <Link className="font-bold underline" href={"/auth/sign-up"}>
          Sign Up
        </Link>
      </p>
    </Card>
  );
};

export default LoginForm;
