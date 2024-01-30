import { MouseEventHandler, ReactNode, useEffect, useRef } from "react";

interface Props {
  open?: boolean;
  onClose?: () => void;
  children?: ReactNode;
}

const Dialog = (props: Props) => {
  const dialog = useRef<HTMLDialogElement>(null);

  const handleBackdropClose: MouseEventHandler<HTMLDialogElement> = (event) => {
    if (event.target === dialog.current) {
      dialog.current.close();
    }
  };

  useEffect(() => {
    if (props.open && dialog.current) {
      dialog.current.showModal();
    } else if (dialog.current) {
      dialog.current.close();
    }
  }, [props.open]);

  return (
    <dialog
      className="backdrop:bg-slate-700 backdrop:opacity-80 bg-transparent"
      ref={dialog}
      onClick={handleBackdropClose}
      onClose={() => props.onClose?.()}
    >
      {props.children}
    </dialog>
  );
};

export default Dialog;
