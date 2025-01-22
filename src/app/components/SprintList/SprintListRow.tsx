"use client";

import { Sprint } from "@/types";
import SprintListCell from "./SprintListCell";
import Link from "next/link";
import { useEffect, useState } from "react";
import RadioButton from "../ui/RadioButton";

interface Prop {
  sprint: Sprint;
  className?: string;
  selected: boolean;
  onSelected: () => void;
}

const SprintListRow = ({ sprint, className, selected, onSelected }: Prop) => {
  const [selectedRow, setSelectedRow] = useState(selected);

  useEffect(() => {
    setSelectedRow(selected);
  }, [selected]);

  const handleSelectionChange = (checked: boolean) => {
    onSelected();
  };

  return (
    <>
      <div className="col-span-3">
        <SprintListCell className={className} selected={selectedRow}>
          <RadioButton
            checked={selectedRow}
            onChange={handleSelectionChange}
            className="mr-2"
          ></RadioButton>

          <Link href={`/widget/${sprint.teamId}/${sprint.name}`}>
            {decodeURI(sprint.name)}
          </Link>
        </SprintListCell>
      </div>
      <div className="col-start-4">
        <SprintListCell
          className={className + " flex justify-end"}
          selected={selectedRow}
        >
          {sprint.length}
        </SprintListCell>
      </div>
      <div className="col-start-5">
        <SprintListCell
          className={className + " flex justify-end"}
          selected={selectedRow}
        >
          {Number(sprint.availability).toFixed(2) + "%"}
        </SprintListCell>
      </div>
    </>
  );
};

export default SprintListRow;
