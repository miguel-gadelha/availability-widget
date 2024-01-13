import { X } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  className: string;
  dismissable?: boolean;
  onDismiss: any;
  children: ReactNode;
}

const Tag = (props: Props) => {
  const handleDismissClick = () => {
    props.onDismiss();
  };

  return (
    <div
      className={`flex justify-between items-center tag bg-slate-900 rounded-2xl text-white px-3 py-1 whitespace-nowrap ${props.className}`}
    >
      {String(props.children)}
      {props.dismissable && (
        <X className="size-4 ml-2 -mr-1" onClick={handleDismissClick} />
      )}
    </div>
  );
};

export default Tag;
