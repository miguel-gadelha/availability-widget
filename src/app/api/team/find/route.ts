import { Team } from "@/app/models/Team";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query;

  if (!email) {
    res.status(400).json({ error: "Bad Request" });
  }

  try {
    const team = await Team.findByEmail(email as string);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    return res.status(200).json(team);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
