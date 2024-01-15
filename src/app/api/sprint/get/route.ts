import { SprintHandler } from "@/app/models/Sprint";
import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const sprint = await SprintHandler.findByName(name as string);

    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    return res.status(200).json(sprint);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
