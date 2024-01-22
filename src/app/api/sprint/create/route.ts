import { withAuth } from "@/app/lib/auth/withAuth";
import { SprintHandler } from "@/app/models/Sprint";
import { TeamSettings } from "@/app/models/Team";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return await withAuth(req, async (team: TeamSettings) => {
    const sprintHandler = new SprintHandler();
    const { name, length, members } = await req.json();

    if (!name || !length || !members || members.length < 1 || !team) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    try {
      await sprintHandler.create(team._id, {
        name,
        length,
        members,
      });

      return NextResponse.json(null, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Unable to create Sprint" },
        { status: 500 }
      );
    }
  });
}
