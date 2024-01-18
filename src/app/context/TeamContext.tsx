"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { TeamSettings } from "../models/Team";
import TeamUtils from "../lib/TeamUtils";

export const TeamContext =
  createContext<Partial<TeamSettings | null | false>>(null);

const TeamContextProvider = ({ children }: { children: ReactNode }) => {
  const [team, setTeam] = useState<Partial<TeamSettings> | null | false>(null);

  useEffect(() => {
    const currentTeam = TeamUtils.getCurrentTeam();

    console.log(currentTeam);
    if (!currentTeam) {
      setTeam(false);
    } else {
      setTeam(currentTeam as TeamSettings);
    }
  }, []);

  return <TeamContext.Provider value={team}>{children}</TeamContext.Provider>;
};

export default TeamContextProvider;
