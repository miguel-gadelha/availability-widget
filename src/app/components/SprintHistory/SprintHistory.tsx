"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, Trash } from "lucide-react";
import Button from "../ui/Button";
import { Sprint } from "@/types";
import axios from "axios";
import Dialog from "../ui/Dialog";
import SprintForm from "../SprintForm/SprintForm";
import Spinner from "../ui/Spinner";
import SprintList, { SprintRow } from "../SprintList/SprintList";
import DeleteSprintButton from "./actions/DeleteSprintButton";

const SprintHistory = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [listIsLoading, setListIsLoading] = useState(true);
  const [moreIsLoading, setMoreIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [loadedAll, setLoadedAll] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

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

  const handleSprintSelection = (key: number) => {
    setSprints((sprints: SprintRow[]) => {
      const newSprints = sprints.map((sprint) => {
        if (Number(sprint.key) === key) {
          return { ...sprint, selected: true };
        } else {
          return { ...sprint, selected: false };
        }
      });

      return newSprints;
    });

    setActiveSprint(sprints[key]);
  };

  const handleEdit = () => {
    setOpenDialog(true);
  };

  const handleOnDelete = () => {
    setSprints((sprints) => {
      const newSprints = [...sprints];

      newSprints.splice(Number(activeSprint!.key), 1);

      return newSprints;
    });

    setActiveSprint(undefined);
  };

  const handleNewSprint = () => {
    setOpenDialog(true);
    setActiveSprint(undefined);
  };

  const onCreateSprint = (sprint: Sprint) => {
    setSprints((sprints) => [sprint, ...sprints]);
    setOpenDialog(false);
    setActiveSprint(undefined);
  };

  return (
    <section className="w-2/3">
      <div className="header w-full mb-11">
        <Button
          type="button"
          className="flex items-center"
          onClick={handleNewSprint}
        >
          <Plus size={16} className="mr-2" />
          New Sprint
        </Button>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <SprintForm
            title={activeSprint ? "Edit Sprint" : "New Sprint"}
            onCreateSprint={onCreateSprint}
            activeSprint={activeSprint}
          />
        </Dialog>
      </div>
      <div className="list-wrapper w-full">
        <div className="list-header flex justify-between">
          <h2 className="text-black text-2xl not-italic font-semibold leading-6 mb-4">
            Sprint History
          </h2>
          <div className="control-buttons">
            <button
              onClick={handleEdit}
              disabled={!activeSprint}
              className={"mr-2 text-slate-900 disabled:text-slate-400"}
            >
              <Edit></Edit>
            </button>

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
