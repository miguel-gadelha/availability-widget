import { Team } from "@/app/models/Team";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  try {
    const token = await Team.login(email, password);

    return Response.json({ token }, { status: 201 });
  } catch (error) {
    console.error(error);

    return Response.json({ status: 500 });
  }
}
