import { Team } from "@/app/models/Team";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  try {
    const token = await Team.login(email, password);
    const expiryDate = new Date();

    expiryDate.setDate(expiryDate.getDate() + 1);
    const cookie = `auth=${token}; Path=/; Expires=${expiryDate.toUTCString()}; HttpOnly`;

    return Response.json(null, {
      status: 201,
      headers: { "Set-Cookie": cookie },
    });
  } catch (error) {
    console.error(error);

    return Response.json({ status: 500 });
  }
}
