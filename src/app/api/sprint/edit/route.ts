import { withAuth } from "@/app/lib/auth/withAuth";
import { SprintHandler } from "@/app/models/Sprint";
import { TeamSettings } from "@/app/models/Team";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return await withAuth(req, async (team: TeamSettings) => {
    const settings = await req.json();

    if (
      Object.keys(settings).length < 1 ||
      !settings.name ||
      !team ||
      !team._id
    ) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    try {
      const sprintHandler = new SprintHandler();

      const response = await sprintHandler.edit(
        team._id,
        settings.name as string,
        settings
      );

      return NextResponse.json({ response }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(null, { status: 500 });
    }
  });
}
