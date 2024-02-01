import { ReactNode } from "react";

interface Props {
  className?: string;
  selected?: boolean;
  children?: ReactNode;
}

const SprintHistoryCell = (props: Props) => {
  return (
    <div
      className={`h-10 flex items-center px-4 py-2 text-nowrap ${
        props.selected ? "bg-slate-100" : "bg-white"
      }  ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default SprintHistoryCell;
