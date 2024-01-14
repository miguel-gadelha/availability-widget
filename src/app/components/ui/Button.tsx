import { ReactNode } from "react";

interface Props {
  className?: string;
  type: HTMLButtonElement["type"];
  children: ReactNode;
  onClick: () => void;
}
const Button = (props: Props) => {
  return (
    <button
      type={props.type}
      className={`rounded-md px-4 py-2 bg-slate-900 hover:bg-slate-800 text-sm font-medium leading-none text-white ${props.className}`}
      onClick={props.onClick}
    >
      {String(props.children)}
    </button>
  );
};

export default Button;
