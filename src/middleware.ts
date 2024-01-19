import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  if (new URL(request.url).pathname === "/") {
    NextResponse.redirect(new URL("/manage", request.url));
  }

  const currentTeam = request.cookies.get("auth")?.value;

  if (!currentTeam) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/api/sprint", "/manage/"],
};
