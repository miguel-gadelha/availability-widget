import { withAuth } from "@/app/lib/auth/withAuth";
import { SprintHandler } from "@/app/models/Sprint";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;

export async function POST(req: NextRequest) {
  return await withAuth(req, async (team) => {
    if (!team) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const body = await req.json();
    let skip = 0;
    let limit = ITEMS_PER_PAGE;

    if (body.page) {
      skip = ITEMS_PER_PAGE * body.page - ITEMS_PER_PAGE;
      limit = ITEMS_PER_PAGE * body.page;
    }

    try {
      const sprints = await SprintHandler.findByTeamId(team._id!, skip, limit);

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
