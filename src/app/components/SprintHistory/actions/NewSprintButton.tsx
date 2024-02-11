"use client";

import { Plus } from "lucide-react";
import SprintForm from "../../SprintForm/SprintForm";
import Button from "../../ui/Button";
import Dialog from "../../ui/Dialog";
import { useContext, useEffect, useState } from "react";
import { Sprint } from "@/types";
import axios from "axios";
import SprintUtils from "@/app/lib/utils/SprintUtils";
import { TeamContext } from "@/app/context/TeamContext";

interface Props {
  onClick?: () => void;
  onSprintCreate?: (sprint: Sprint) => void;
}

const NewSprintButton = ({ onClick, onSprintCreate }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSprint, setNewSprint] = useState<Sprint>();

  const teamContext = useContext(TeamContext);

  useEffect(() => {
    const emptySprint: Sprint = {
      name: "",
      length: 0,
      members: [],
    };

    if (teamContext && teamContext.teamMembers) {
      const members = teamContext.teamMembers.map((member) => {
        return { name: member, days: 0 };
      });

      emptySprint.members = members;

      setNewSprint(emptySprint);
    }
  }, [teamContext]);

  if (!teamContext) {
    return;
  }

  const handleClick = () => {
    setIsOpen(true);
    onClick?.();
  };

  const handleSubmit = () => {
    if (!newSprint) {
      return;
    }

    setIsLoading(true);

    axios
      .post("/api/sprint/create", newSprint, {
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

        onSprintCreate?.({
          name: encodeURI(newSprint.name),
          length: newSprint.length,
          members: newSprint.members,
          availability: SprintUtils.calculateAvailability(
            newSprint.members,
            newSprint.length
          ),
        } as Sprint);

        setIsOpen(false);
        setIsLoading(false);
        setNewSprint(undefined);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (sprint: Sprint) => {
    setNewSprint(sprint);
  };

  return (
    <>
      <Button type="button" className="flex items-center" onClick={handleClick}>
        <Plus size={16} className="mr-2" />
        New Sprint
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        {newSprint && (
          <SprintForm
            sprint={newSprint}
            onSubmit={handleSubmit}
            onInputChange={handleChange}
            isLoading={isLoading}
          />
        )}
      </Dialog>
    </>
  );
};

export default NewSprintButton;
