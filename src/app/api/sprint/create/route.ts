import { SprintHandler } from "@/app/models/Sprint";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const sprintHandler = new SprintHandler();
  const { name, length, members } = await req.json();

  if (!name || !length || !members || members.length < 1) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  try {
    const teamId = new ObjectId("65a6ef0f099c1352d7a334aa");
    await sprintHandler.create(teamId, { name, length, members });

    return Response.json({}, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ status: 500 });
  }
}
