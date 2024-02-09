"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Trash } from "lucide-react";
import Button from "../../ui/Button";
import { SprintRow } from "../../SprintList/SprintList";
import axios from "axios";
import { useState } from "react";

interface Props {
  sprintToDelete?: SprintRow;
  onError?: () => void;
  onDelete?: () => void;
}

const DeleteSprintButton = ({ sprintToDelete, onError, onDelete }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    if (!sprintToDelete) {
      return;
    }

    setIsLoading(true);

    axios
      .post(
        "/api/sprint/delete",
        { name: sprintToDelete.name },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status !== 201) {
          onError?.();
        } else {
          setIsLoading(false);
          setIsOpen(false);
          onDelete?.();
        }
      })
      .catch((error) => {
        console.log("error", error);
        onError?.();
      });
  };
  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger
        disabled={sprintToDelete === undefined}
        className={"text-slate-900 disabled:text-slate-400"}
      >
        <Trash></Trash>
      </PopoverTrigger>
      <PopoverContent
        className="
        z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
        bg-white w-52"
      >
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
            isLoading={isLoading}
          >
            Yes
          </Button>
          <Button
            type="button"
            className="w-1/2 ml-2"
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            No
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteSprintButton;
