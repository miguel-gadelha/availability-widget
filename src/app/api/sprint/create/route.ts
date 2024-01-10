import { SprintHandler } from "../../../models/Sprint";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sprintHandler = new SprintHandler();
  const { name, length, members } = req.body;

  if (!name || !length || !members || members.length < 1) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    await sprintHandler.create({ name, length, members });

    return res.status(201);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
