import { Sprint } from "@/types";
import SprintListCell from "./SprintListCell";
import SprintListRow from "./SprintListRow";

export interface SprintRow extends Sprint {
  key?: string;
  selected?: boolean;
}

interface Props {
  sprints: Sprint[];
  onSelected?: (sprintKey: number) => void;
}

const SprintList = ({ sprints, onSelected }: Props) => {
  return (
    <div className="list-items grid grid-cols-5 grid-flow-row gap-[1px] bg-slate-200 p-[1px]">
      <div className="col-span-3">
        <SprintListCell className="text-ellipsis text-base not-italic font-bold leading-6">
          Name
        </SprintListCell>
      </div>
      <div className="col-start-4">
        <SprintListCell className="text-ellipsis text-base not-italic font-bold leading-6">
          Length (in days)
        </SprintListCell>
      </div>
      <div className="col-start-5">
        <SprintListCell className="text-ellipsis text-base not-italic font-bold leading-6">
          Availability
        </SprintListCell>
      </div>
      {sprints.map((sprint: SprintRow, key: number) => {
        sprint.key = String(key);

        return (
          <SprintListRow
            className="text-ellipsis text-base not-italic font-normal leading-6"
            key={sprint.key}
            sprint={sprint}
            onSelected={() => onSelected?.(Number(sprint.key!))}
            selected={sprint.selected || false}
          />
        );
      })}
    </div>
  );
};

export default SprintList;
