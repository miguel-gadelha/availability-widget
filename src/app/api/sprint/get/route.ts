import { SprintHandler } from "@/app/models/Sprint";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { teamId, name } = await req.json();

  if (!name || !teamId) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  try {
    const sprint = await SprintHandler.findByName(teamId, name);

    if (!sprint) {
      return NextResponse.json({ error: "Sprint not found" }, { status: 404 });
    }

    return NextResponse.json({ sprint }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
