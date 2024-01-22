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
    const token = decode(auth.value) as Partial<{ team: TeamSettings }>;

    return await next(token.team as TeamSettings);
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}
