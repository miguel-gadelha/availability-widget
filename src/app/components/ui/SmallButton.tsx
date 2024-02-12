import { ReactNode } from "react";

interface Props {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
}

const SmallButton = ({ onClick, children, className, disabled }: Props) => {
  return (
    <button
      className={`flex justify-center items-center bg-white p-3 rounded-md border-solid hover:bg-white/90 disabled:bg-gray-400 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SmallButton;
