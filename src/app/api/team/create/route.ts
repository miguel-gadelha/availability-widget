import { Team } from "@/app/models/Team";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, password, email, teamMembers } = await req.json();

  if (!name || !password || !email || !teamMembers || teamMembers.length < 1) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  try {
    const team = new Team(name, password, email, teamMembers);
    const newTeam = await team.save();

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(error, { status: 500 });
  }
}
