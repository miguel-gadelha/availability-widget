"use client";

import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import Button from "../ui/Button";
import { Sprint } from "@/types";
import axios from "axios";
import Spinner from "../ui/Spinner";
import SprintList, { SprintRow } from "../SprintList/SprintList";
import DeleteSprintButton from "./actions/DeleteSprintButton";
import NewSprintButton from "./actions/NewSprintButton";
import TeamContextProvider from "@/app/context/TeamContext";
import EditSprintButton from "./actions/EditSprintButton";

const SprintHistory = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [listIsLoading, setListIsLoading] = useState(true);
  const [moreIsLoading, setMoreIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [loadedAll, setLoadedAll] = useState(false);

  const [showError, setShowError] = useState(false);
  const [activeSprint, setActiveSprint] = useState<SprintRow>();

  // Pagination handling
  useEffect(() => {
    setMoreIsLoading(true);

    axios
      .post(
        "/api/sprint/get/all",
        { page },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setListIsLoading(false);
        if (response.status !== 201) {
          setShowError(true);
        }

        if (response.data.sprints.length === 0) {
          setLoadedAll(true);
        } else {
          setSprints((state) => {
            return [...state, ...response.data.sprints];
          });
        }
        setMoreIsLoading(false);
      });
  }, [page]);

  // Updating Selection
  useEffect(() => {
    setSprints((sprints: SprintRow[]) => {
      let newSprints;

      if (activeSprint?.key) {
        newSprints = sprints.map((sprint) => {
          if (sprint.key === activeSprint.key) {
            return { ...sprint, selected: true };
          } else {
            return { ...sprint, selected: false };
          }
        });
      } else {
        newSprints = sprints.map((sprint) => {
          return { ...sprint, selected: false };
        });
      }

      return newSprints;
    });
  }, [activeSprint]);

  const handleSprintSelection = (key: number) => {
    setActiveSprint(sprints[key]);
  };

  const handleOnEdit = (sprint: SprintRow) => {
    setActiveSprint(undefined);

    setSprints((sprints) => {
      const newSprints = [...sprints];

      const index = newSprints.findIndex(
        (newSprint) => newSprint.name === sprint.name
      );

      if (index !== -1) {
        newSprints[index] = sprint;
      }

      return newSprints;
    });
  };

  const handleOnDelete = (key: number) => {
    setSprints((sprints) => {
      const newSprints = [...sprints];

      newSprints.splice(key, 1);

      return newSprints;
    });

    setActiveSprint(undefined);
  };

  const handleOnCreatedSprint = (sprint: Sprint) => {
    setSprints((sprints) => [sprint, ...sprints]);
    setActiveSprint(undefined);
  };

  return (
    <section className="w-2/3">
      <div className="header w-full mb-11">
        <TeamContextProvider>
          <NewSprintButton
            onClick={() => setActiveSprint(undefined)}
            onSprintCreate={handleOnCreatedSprint}
          />
        </TeamContextProvider>
      </div>
      <div className="list-wrapper w-full">
        <div className="list-header flex justify-between">
          <h2 className="text-black text-2xl not-italic font-semibold leading-6 mb-4">
            Sprint History
          </h2>
          <div className="control-buttons">
            <EditSprintButton
              sprintToEdit={activeSprint}
              onSprintEdit={handleOnEdit}
            />
            <DeleteSprintButton
              sprintToDelete={activeSprint}
              onDelete={handleOnDelete}
            />
          </div>
        </div>

        {listIsLoading ? (
          <div className="w-full h-60 flex justify-center items-center">
            <Spinner width={32} height={32} />
          </div>
        ) : (
          <SprintList sprints={sprints} onSelected={handleSprintSelection} />
        )}
      </div>
      {!loadedAll && sprints.length === 10 && (
        <div className="w-full flex justify-center mt-8">
          <Button
            type="button"
            onClick={() => setPage(page + 1)}
            isLoading={moreIsLoading}
          >
            Load More
          </Button>
        </div>
      )}
    </section>
  );
};

export default SprintHistory;
