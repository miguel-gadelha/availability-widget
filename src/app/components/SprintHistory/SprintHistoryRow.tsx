import { Sprint } from "@/types";
import SprintHistoryCell from "./SprintHistoryCell";
import Link from "next/link";

interface Prop {
  sprint: Sprint;
  className?: string;
}

const SprintHistoryRow = (props: Prop) => {
  return (
    <>
      <div className="col-span-3">
        <SprintHistoryCell className={props.className}>
          {
            <Link
              href={encodeURI(
                `/widget/${props.sprint.teamId}/${props.sprint.name}`
              )}
            >
              {props.sprint.name}
            </Link>
          }
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
