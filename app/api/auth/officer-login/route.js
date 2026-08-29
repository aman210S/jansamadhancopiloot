import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { officerId, password } = await request.json();

    if (!officerId || !password) {
      return NextResponse.json(
        { error: "Officer ID and password are required." },
        { status: 400 },
      );
    }

    const db = readDb();
    const officer = db.officers.find(
      (o) =>
        o.id.toLowerCase() === String(officerId).trim().toLowerCase() &&
        o.password === password,
    );

    if (!officer) {
      return NextResponse.json(
        { error: "Invalid officer ID or password." },
        { status: 401 },
      );
    }

    return NextResponse.json({
      officer: {
        id: officer.id,
        name: officer.name,
        role: officer.role,
        zone: officer.zone,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Officer login failed. Please try again." }, { status: 500 });
  }
}
