import { SprintHandler } from "@/app/models/Sprint";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  const settings = req.body;

  if (Object.keys(settings).length < 1 || !name) {
    res.status(400).json({ error: "Bad Request" });
  }

  try {
    const sprintHandler = new SprintHandler();

    await sprintHandler.edit(name as string, settings);

    return res.status(200);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
