import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

const SprintHistoryCell = (props: Props) => {
  return (
    <div
      className={`h-10 flex items-center px-4 py-2 text-nowrap bg-white ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default SprintHistoryCell;
