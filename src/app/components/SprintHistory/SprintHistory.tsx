"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../ui/Button";
import { Sprint } from "@/types";
import axios from "axios";
import SprintHistoryCell from "./SprintHistoryCell";
import SprintHistoryRow from "./SprintHistoryRow";
import Dialog from "../ui/Dialog";
import SprintForm from "../SprintForm/SprintForm";

const SprintHistory = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadedAll, setLoadedAll] = useState(false);
  const [showError, setShowError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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
        setIsLoading(false);
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

  return (
    <section>
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
          <SprintForm onCreateSprint={() => setOpenDialog(false)} />
        </Dialog>
      </div>
      <div className="list-wrapper w-full">
        <h2 className="text-black text-2xl not-italic font-semibold leading-6 mb-4">
          Sprint History
        </h2>
        {isLoading ? (
          "Is loading"
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
            {sprints.map((sprint: Sprint, key: number) => {
              return (
                <SprintHistoryRow
                  className="text-ellipsis text-base not-italic font-normal leading-6"
                  key={key}
                  sprint={sprint}
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
