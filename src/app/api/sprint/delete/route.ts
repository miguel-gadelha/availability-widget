import { withAuth } from "@/app/lib/auth/withAuth";
import { SprintHandler } from "@/app/models/Sprint";
import { TeamSettings } from "@/app/models/Team";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return await withAuth(req, async (team: TeamSettings) => {
    const sprintHandler = new SprintHandler();
    const { name } = await req.json();

    if (!team._id || !name) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    try {
      await sprintHandler.delete(team._id, name);
      return NextResponse.json({}, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Unable to delete sprint" },
        { status: 500 }
      );
    }
  });
}
