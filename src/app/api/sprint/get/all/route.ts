import { withAuth } from "@/app/lib/auth/withAuth";
import { SprintHandler } from "@/app/models/Sprint";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return await withAuth(req, async (team) => {
    if (!team) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    try {
      const sprints = await SprintHandler.findByTeamId(team._id);

      if (!sprints) {
        return NextResponse.json(
          { error: "Could not get sprints" },
          { status: 404 }
        );
      }

      return NextResponse.json({ sprints }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  });
}
