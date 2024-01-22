"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { TeamSettings } from "../models/Team";
import TeamUtils from "../lib/utils/TeamUtils";

export const TeamContext =
  createContext<Partial<TeamSettings | null | false>>(null);

const TeamContextProvider = ({ children }: { children: ReactNode }) => {
  const [team, setTeam] = useState<Partial<TeamSettings> | null | false>(null);

  useEffect(() => {
    const currentTeam = TeamUtils.getCurrentTeam();

    if (
      currentTeam &&
      typeof currentTeam === "object" &&
      "team" in currentTeam
    ) {
      setTeam(currentTeam.team as TeamSettings);
    } else {
      setTeam(false);
    }
  }, []);

  return <TeamContext.Provider value={team}>{children}</TeamContext.Provider>;
};

export default TeamContextProvider;
