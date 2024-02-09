"use client";

import { Plus } from "lucide-react";
import SprintForm from "../../SprintForm/SprintForm";
import Button from "../../ui/Button";
import Dialog from "../../ui/Dialog";
import { useState } from "react";
import { Sprint } from "@/types";

interface Props {
  onClick?: () => void;
  onSprintCreate?: (sprint: Sprint) => void;
}

const NewSprintButton = ({ onClick, onSprintCreate }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
    onClick?.();
  };

  const handleCreateSprint = (sprint: Sprint) => {
    setIsOpen(false);
    onSprintCreate?.(sprint);
  };

  return (
    <>
      <Button type="button" className="flex items-center" onClick={handleClick}>
        <Plus size={16} className="mr-2" />
        New Sprint
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <SprintForm title={"New Sprint"} onCreateSprint={handleCreateSprint} />
      </Dialog>
    </>
  );
};

export default NewSprintButton;
