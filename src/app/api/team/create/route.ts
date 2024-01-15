import { Team } from "@/app/models/Team";
import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { name, password, email, teamMembers } = req.body;

  if (!name || !password || !email || !teamMembers || teamMembers.length < 1) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const team = new Team(name, password, email, teamMembers);
    const newTeam = await team.save();

    return res.status(201).json(newTeam);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
