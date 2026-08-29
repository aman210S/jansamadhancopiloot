import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const db = readDb();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password. Please try again." },
        { status: 401 },
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
