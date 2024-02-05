"use client";

import { Sprint } from "@/types";
import SprintHistoryCell from "./SprintHistoryCell";
import Link from "next/link";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import RadioButton from "../ui/RadioButton";

interface Prop {
  sprint: Sprint;
  className?: string;
  selected: boolean;
  onSelected: () => void;
}

const SprintHistoryRow = ({
  sprint,
  className,
  selected,
  onSelected,
}: Prop) => {
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
        <SprintHistoryCell className={className} selected={selectedRow}>
          <RadioButton
            checked={selectedRow}
            onChange={handleSelectionChange}
            className="mr-2"
          ></RadioButton>

          <Link href={`/widget/${sprint.teamId}/${sprint.name}`}>
            {decodeURI(sprint.name)}
          </Link>
        </SprintHistoryCell>
      </div>
      <div className="col-start-4">
        <SprintHistoryCell
          className={className + " flex justify-end"}
          selected={selectedRow}
        >
          {sprint.length}
        </SprintHistoryCell>
      </div>
      <div className="col-start-5">
        <SprintHistoryCell
          className={className + " flex justify-end"}
          selected={selectedRow}
        >
          {Number(sprint.availability) + "%"}
        </SprintHistoryCell>
      </div>
    </>
  );
};

export default SprintHistoryRow;
