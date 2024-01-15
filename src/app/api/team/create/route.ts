import { Team } from "@/app/models/Team";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, password, email, teamMembers } = await req.json();

  Response.json({ something: true });

  if (!name || !password || !email || !teamMembers || teamMembers.length < 1) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  try {
    const team = new Team(name, password, email, teamMembers);
    const newTeam = await team.save();

    return Response.json(newTeam, { status: 201 });
  } catch (error) {
    console.error(error);

    return Response.json(error, { status: 500 });
  }
}
