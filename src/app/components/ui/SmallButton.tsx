import { ReactNode } from "react";

interface Props {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

const SmallButton = ({ onClick, children, className }: Props) => {
  return (
    <button
      className={`flex justify-center items-center bg-white p-3 rounded-md border-solid hover:bg-white/90 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SmallButton;
