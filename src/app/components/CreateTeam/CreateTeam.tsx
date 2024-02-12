"use client";

import { useState } from "react";
import TeamForm, { TeamWithPassword } from "../TeamForm/TeamForm";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreateTeam = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [team, setTeam] = useState<TeamWithPassword>({
    name: "",
    password: "",
    email: "",
    teamMembers: [],
  });

  const router = useRouter();

  const handleInputChange = (team: TeamWithPassword) => {
    setTeam(team);
  };

  const handleSubmit = () => {
    const request_body = {
      name: team.name,
      email: team.email,
      password: team.password,
      teamMembers: team.teamMembers,
    };

    setIsLoading(true);

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
          return;
        }

        setIsLoading(false);

        router.push("/auth/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <TeamForm
      team={team}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      title="Sign up"
    />
  );
};

export default CreateTeam;
