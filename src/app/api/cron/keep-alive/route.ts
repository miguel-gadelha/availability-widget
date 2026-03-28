import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        debug: {
          receivedHeader: authHeader ? `Bearer <${authHeader.length - 7} chars>` : null,
          envSecretSet: !!process.env.CRON_SECRET,
          envSecretLength: process.env.CRON_SECRET?.length ?? 0,
        },
      },
      { status: 401 }
    );
  }

  if (!process.env.MONGODB_CONNECTION_STRING) {
    return NextResponse.json(
      { error: "MONGODB_CONNECTION_STRING is not defined." },
      { status: 500 }
    );
  }

  let client: MongoClient | undefined;
  try {
    const pingedAt = new Date();
    client = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING);
    const db = client.db("sprint_availability");
    await db.collection("management").updateOne(
      { _id: "keep_alive" as unknown as import("mongodb").ObjectId },
      { $set: { last_ping: pingedAt } },
      { upsert: true }
    );
    return NextResponse.json({ ok: true, pingedAt: pingedAt.toISOString() });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to ping MongoDB: ${error}` },
      { status: 500 }
    );
  } finally {
    await client?.close();
  }
}
