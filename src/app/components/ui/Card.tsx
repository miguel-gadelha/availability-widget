import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

const Card = (props: Props) => {
  return (
    <div
      className={`bg-white rounded-lg border bg-card text-card-foreground shadow-sm p-6 ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default Card;
