import { ReactNode } from "react";

interface Props {
  className?: string;
  type: HTMLButtonElement["type"];
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "destructive" | "secondary";
}
const Button = (props: Props) => {
  const defaultClass = " bg-slate-900 hover:bg-slate-800 text-white";
  const destructiveClass = "bg-red-500 text-white hover:bg-red-500/90";
  const secondaryClass = "bg-slate-200 text-slate-900 hover:bg-slate-200/80";

  const getVariantClasses = () => {
    if (props.variant === "destructive") {
      return destructiveClass;
    } else if (props.variant === "secondary") {
      return secondaryClass;
    }

    return defaultClass;
  };
  return (
    <button
      type={props.type}
      className={`rounded-md px-4 py-2 text-sm font-medium leading-nonedisabled:bg-gray-400   ${getVariantClasses()} ${
        props.className
      }`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
