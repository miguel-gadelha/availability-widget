"use client";

import { Sprint } from "@/types";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Card from "../ui/Card";

interface Props {
  teamId: string;
  sprint: string;
}

const SprintWidget = (props: Props) => {
  const [error, setError] = useState(true);
  const [sprint, setSprint] = useState<Sprint | null>(null);

  useEffect(() => {
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

        setSprint(response.data.sprint);
      });
  }, [props.teamId, props.sprint]);

  const availabilityType = (availabilty: number) => {
    if (Number(availabilty) < 50) {
      return "text-red-600";
    }

    if (Number(availabilityType) < 70) {
      return "text-yellow-600";
    }

    return "text-green-600";
  };

  return (
    <>
      {sprint && (
        <Card>
          <h3 className="text-slate-900 text-lg not-italic font-semibold leading-7 mb-5">
            {decodeURI(sprint!.name)}
          </h3>
          <div
            className={`w-36 h-9 text-[40px] not-italic font-semibold leading-7 ${availabilityType(
              sprint.availability!
            )}`}
          >
            {Number(sprint.availability).toFixed(2) + "%"}
          </div>
        </Card>
      )}
    </>
  );
};

export default SprintWidget;
