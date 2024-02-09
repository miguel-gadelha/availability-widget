"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, Trash } from "lucide-react";
import Button from "../ui/Button";
import { Sprint } from "@/types";
import axios from "axios";
import Dialog from "../ui/Dialog";
import SprintForm from "../SprintForm/SprintForm";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/Popover";
import Spinner from "../ui/Spinner";
import SprintList, { SprintRow } from "../SprintList/SprintList";

const SprintHistory = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [actionIsLoading, setActionIsLoading] = useState(false);
  const [listIsLoading, setListIsLoading] = useState(true);
  const [moreIsLoading, setMoreIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [loadedAll, setLoadedAll] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [radioSelected, setRadioSelected] = useState<number>();
  const [popupOpen, setPopupOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [activeSprint, setActiveSprint] = useState<Sprint>();

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

  const handleEdit = () => {
    setOpenDialog(true);
  };

  const handleDelete = () => {
    if (!radioSelected && radioSelected !== 0) {
      return;
    }

    setActionIsLoading(true);

    axios
      .post(
        "/api/sprint/delete",
        { name: sprints[radioSelected].name },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status !== 201) {
          setShowError(true);
        } else {
          setSprints((sprints) => {
            const newSprints = [...sprints];

            newSprints.splice(radioSelected, 1);

            return newSprints;
          });

          setRadioSelected(undefined);
          setPopupOpen(false);
          setActionIsLoading(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleNewSprint = () => {
    setRadioSelected(undefined);
    setOpenDialog(true);
  };

  // Selection Handling
  useEffect(() => {
    setSprints((sprints: SprintRow[]) => {
      const newSprints = sprints.map((sprint) => {
        if (Number(sprint.key) === radioSelected) {
          return { ...sprint, selected: true };
        } else {
          return { ...sprint, selected: false };
        }
      });

      setActiveSprint(newSprints[radioSelected!]);

      return newSprints;
    });
  }, [radioSelected]);

  const onCreateSprint = (sprint: Sprint) => {
    setSprints((sprints) => [sprint, ...sprints]);
    setOpenDialog(false);
    setRadioSelected(undefined);
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
            title={radioSelected !== undefined ? "Edit Sprint" : "New Sprint"}
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
              disabled={!radioSelected && radioSelected !== 0}
              className={"mr-2 text-slate-900 disabled:text-slate-400"}
            >
              <Edit></Edit>
            </button>

            <Popover
              open={popupOpen}
              onOpenChange={(open) => setPopupOpen(open)}
            >
              <PopoverTrigger
                disabled={!radioSelected && radioSelected !== 0}
                className={"text-slate-900 disabled:text-slate-400"}
              >
                <Trash></Trash>
              </PopoverTrigger>
              <PopoverContent className="bg-white w-52">
                <div className="mb-3">
                  <h4 className="font-medium leading-none mb-1 text-slate-900">
                    Are you sure?
                  </h4>
                  <p className="text-sm text-slate-500 text-muted-foreground">
                    This can&apos;t be undone
                  </p>
                </div>

                <div className="flex">
                  <Button
                    type="button"
                    className={`w-1/2`}
                    onClick={handleDelete}
                    variant="destructive"
                    isLoading={actionIsLoading}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    className="w-1/2 ml-2"
                    variant="secondary"
                  >
                    No
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {listIsLoading ? (
          <div className="w-full h-60 flex justify-center items-center">
            <Spinner width={32} height={32} />
          </div>
        ) : (
          <SprintList sprints={sprints} onSelected={setRadioSelected} />
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
