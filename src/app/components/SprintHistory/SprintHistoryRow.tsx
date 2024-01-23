import { Sprint } from "@/types";
import SprintHistoryCell from "./SprintHistoryCell";

interface Prop {
  sprint: Sprint;
  className?: string;
}

const SprintHistoryRow = (props: Prop) => {
  return (
    <>
      <div className="col-span-3">
        <SprintHistoryCell className={props.className}>
          {props.sprint.name}
        </SprintHistoryCell>
      </div>
      <div className="col-start-4">
        <SprintHistoryCell className={props.className + " flex justify-end"}>
          {props.sprint.length}
        </SprintHistoryCell>
      </div>
      <div className="col-start-5">
        <SprintHistoryCell className={props.className + " flex justify-end"}>
          {Number(props.sprint.availability) + "%"}
        </SprintHistoryCell>
      </div>
    </>
  );
};

export default SprintHistoryRow;
