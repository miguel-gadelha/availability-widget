import { ReactNode } from "react";
import Spinner from "./Spinner";

interface Props {
  className?: string;
  type: HTMLButtonElement["type"];
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "destructive" | "secondary";
  isLoading?: boolean;
}
const Button = ({
  type,
  className,
  onClick,
  disabled,
  children,
  variant,
  isLoading,
}: Props) => {
  const defaultClass = " bg-slate-900 hover:bg-slate-800 text-white";
  const destructiveClass = "bg-red-500 text-white hover:bg-red-500/90";
  const secondaryClass = "bg-slate-200 text-slate-900 hover:bg-slate-200/80";

  const getVariantClasses = () => {
    if (variant === "destructive") {
      return destructiveClass;
    } else if (variant === "secondary") {
      return secondaryClass;
    }

    return defaultClass;
  };
  return (
    <button
      type={type}
      className={`rounded-md px-4 py-2 text-sm font-medium leading-nonedisabled:bg-gray-400 flex items-center justify-center ${getVariantClasses()} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {isLoading && <Spinner className="ml-3" />}
    </button>
  );
};

export default Button;
