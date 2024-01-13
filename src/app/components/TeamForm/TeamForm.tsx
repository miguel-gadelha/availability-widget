import Link from "next/link";
import Input from "../Input/Input";
import MultipleTagInput from "../MulipleTagInput/MultipleTagInput";
import Card from "../ui/Card";
import Button from "../ui/button";

const TeamForm = () => {
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
      ></Input>
      <Input
        className="mb-4"
        type="email"
        placeholder="Add your team email"
        label="Email"
      ></Input>
      <Input
        className="mb-4"
        type="password"
        placeholder="Add your password"
        label="Password"
      ></Input>
      <MultipleTagInput
        label="Team Members"
        placeholder="Insert names separated by a comma ( , )"
        className="mb-4"
      ></MultipleTagInput>

      <Button type="button" className="w-full">
        Sign Up
      </Button>

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
