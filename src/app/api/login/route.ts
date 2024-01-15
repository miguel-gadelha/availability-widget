import { Team } from "@/app/models/Team";
import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Bad Request" });
  }

  try {
    const token = await Team.login(email, password);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
