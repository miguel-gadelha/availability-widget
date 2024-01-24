"use client";

import { Sprint } from "@/types";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

interface Props {
  teamId: string;
  sprint: string;
}

const SprintWidget = (props: Props) => {
  const [error, setError] = useState(true);
  const [sprint, setSprint] = useState<Sprint | null>(null);

  useEffect(() => {
    console.log("USEEFFECT");
    axios
      .post(
        "/api/sprint/get",
        { teamId: props.teamId, name: props.sprint },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response: AxiosResponse) => {
        if (response.status !== 201) {
          setError(true);
        }

        setError(false);
        setSprint(response.data.sprint);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <div>
      {JSON.stringify(sprint)} or {String(error)}
    </div>
  );
};

export default SprintWidget;
