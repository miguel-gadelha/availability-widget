import { TeamSettings } from "@/app/models/Team";
import { Secret, decode, verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function withAuth(
  req: NextRequest,
  next: (team: TeamSettings) => Promise<NextResponse>
) {
  const auth = req.cookies.get("auth");

  if (!auth) {
    return NextResponse.redirect("/auth/login");
  }

  try {
    const team = decode(auth.value) as TeamSettings;

    return await next(team);
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}
