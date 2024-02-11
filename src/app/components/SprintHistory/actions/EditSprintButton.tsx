import { use, useEffect, useState } from "react";
import SprintForm from "../../SprintForm/SprintForm";
import Dialog from "../../ui/Dialog";
import { Edit } from "lucide-react";
import { SprintRow } from "../../SprintList/SprintList";
import { Sprint } from "@/types";
import axios from "axios";

interface Props {
  sprintToEdit?: SprintRow;
  onSprintEdit?: (sprint: SprintRow) => void;
}

const EditSprintButton = ({ sprintToEdit, onSprintEdit }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSprint, setNewSprint] = useState<SprintRow | undefined>(
    sprintToEdit
  );

  useEffect(() => {
    setNewSprint(sprintToEdit);
  }, [sprintToEdit]);

  const handleEdit = () => {
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (!newSprint) {
      return;
    }

    setIsLoading(true);

    const settings = {
      name: newSprint.name,
      length: newSprint.length,
      members: newSprint.members,
    };

    axios
      .post("/api/sprint/edit", settings, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (response.status !== 201) {
          console.error(response);

          return;
        }

        onSprintEdit?.({
          ...newSprint,
          availability: response.data.response.availability,
        });

        setIsLoading(false);
        setIsOpen(false);
      });
  };

  const handleChange = (sprint: Sprint) => {
    setNewSprint(sprint);
  };

  return (
    <>
      <button
        onClick={handleEdit}
        disabled={!newSprint}
        className={"mr-2 text-slate-900 disabled:text-slate-400"}
      >
        <Edit></Edit>
      </button>
      {newSprint && (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          {sprintToEdit && (
            <SprintForm
              sprint={newSprint}
              onSubmit={handleSubmit}
              onInputChange={handleChange}
              isLoading={isLoading}
            />
          )}
        </Dialog>
      )}
    </>
  );
};

export default EditSprintButton;
