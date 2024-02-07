"use client";

import { useEffect, useRef, useState } from "react";
import { Edit, Plus, Trash } from "lucide-react";
import Button from "../ui/Button";
import { Sprint } from "@/types";
import axios from "axios";
import SprintHistoryCell from "./SprintHistoryCell";
import SprintHistoryRow from "./SprintHistoryRow";
import Dialog from "../ui/Dialog";
import SprintForm from "../SprintForm/SprintForm";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/Popover";
import Spinner from "../ui/Spinner";

interface SprintRow extends Sprint {
  key?: string;
  selected?: boolean;
}

const SprintHistory = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [actionIsLoading, setActionIsLoading] = useState(false);
  const [listIsLoading, setListIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadedAll, setLoadedAll] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [radioSelected, setRadioSelected] = useState<number>();
  const [popupOpen, setPopupOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const popover = useRef<HTMLDivElement>();

  // Pagination handling
  useEffect(() => {
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
      });
  }, [page]);

  const handleEdit = () => {};

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

  // Selection Handling
  useEffect(() => {
    setSprints((sprints: SprintRow[]) => {
      return sprints.map((sprint) => {
        if (Number(sprint.key) === radioSelected) {
          return { ...sprint, selected: true };
        } else {
          return { ...sprint, selected: false };
        }
      });
    });
  }, [radioSelected]);

  const onCreateSprint = (sprint: Sprint) => {
    setSprints((sprints) => [sprint, ...sprints]);
    setOpenDialog(false);
  };

  return (
    <section className="w-2/3">
      <div className="header w-full mb-11">
        <Button
          type="button"
          className="flex items-center"
          onClick={() => setOpenDialog(true)}
        >
          <Plus size={16} className="mr-2" />
          New Sprint
        </Button>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <SprintForm onCreateSprint={onCreateSprint} />
        </Dialog>
      </div>
      <div className="list-wrapper w-full">
        <div className="list-header flex justify-between">
          <h2 className="text-black text-2xl not-italic font-semibold leading-6 mb-4">
            Sprint History
          </h2>
          <div className="control-buttons">
            <button className="mr-2" onClick={handleEdit}>
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
                    className={`w-1/2 flex items-center ${
                      actionIsLoading ? "justify-between" : "justify-center"
                    }`}
                    onClick={handleDelete}
                    variant="destructive"
                  >
                    Yes
                    {actionIsLoading && <Spinner></Spinner>}
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
          <div className="list-items grid grid-cols-5 grid-flow-row gap-[1px] bg-slate-200 p-[1px]">
            <div className="col-span-3">
              <SprintHistoryCell className="text-ellipsis text-base not-italic font-bold leading-6">
                Name
              </SprintHistoryCell>
            </div>
            <div className="col-start-4">
              <SprintHistoryCell className="text-ellipsis text-base not-italic font-bold leading-6">
                Length (in days)
              </SprintHistoryCell>
            </div>
            <div className="col-start-5">
              <SprintHistoryCell className="text-ellipsis text-base not-italic font-bold leading-6">
                Availability
              </SprintHistoryCell>
            </div>
            {sprints.map((sprint: SprintRow, key: number) => {
              sprint.key = sprint.key || String(key);

              return (
                <SprintHistoryRow
                  className="text-ellipsis text-base not-italic font-normal leading-6"
                  key={sprint.key}
                  sprint={sprint}
                  onSelected={() => setRadioSelected(Number(sprint.key!))}
                  selected={sprint.selected || false}
                />
              );
            })}
            {!loadedAll && sprints.length === 10 && (
              <Button type="button" onClick={() => setPage(page + 1)}>
                Load More
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SprintHistory;
