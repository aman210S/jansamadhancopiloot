import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const db = readDb();
    const normalizedEmail = email.toLowerCase();
    const exists = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 409 },
      );
    }

    const user = {
      id: `U-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || "",
      password,
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    writeDb(db);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
