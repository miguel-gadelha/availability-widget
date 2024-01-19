import { withAuth } from "@/app/lib/auth/withAuth";
import { SprintHandler } from "@/app/models/Sprint";
import { TeamSettings } from "@/app/models/Team";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await withAuth(req, async (team: TeamSettings) => {
    const settings = await req.json();
    const name = new URL(req.url).searchParams.get("name");

    if (Object.keys(settings).length < 1 || !name || !team) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    try {
      const sprintHandler = new SprintHandler();

      await sprintHandler.edit(team.teamId, name as string, settings);

      return NextResponse.json(null, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  });
}
