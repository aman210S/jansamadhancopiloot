import { NextResponse } from "next/server";
import { readDb, writeDb, nextGrievanceId } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      category,
      details,
      location,
      officerName,
      userEmail,
      userName,
      photo,
      priority,
      status,
    } = body || {};

    if (!details || details.trim().length < 12) {
      return NextResponse.json(
        { error: "Please describe the problem in at least 12 characters." },
        { status: 400 },
      );
    }
    if (!location || !location.trim()) {
      return NextResponse.json(
        { error: "Please provide a location for the grievance." },
        { status: 400 },
      );
    }

    const db = readDb();
    const ref = nextGrievanceId();
    const now = new Date().toISOString();

    const grievance = {
      id: ref,
      title: title || category || "Civic service grievance",
      category: category || "Other",
      details,
      location,
      officer: officerName || "Unassigned",
      citizen: userEmail || "guest",
      citizenName: userName || "Guest",
      photo: photo || "",
      priority: priority || "HIGH",
      status: status || "Routed",
      createdAt: now,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      steps: [
        { label: "Submitted", done: true, at: now },
        { label: "Routed", done: true, at: now },
        { label: "Under Inspection", done: false, at: null },
        { label: "Resolved", done: false, at: null },
      ],
    };

    db.grievances.unshift(grievance);
    writeDb(db);

    return NextResponse.json({ grievance }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not submit the grievance. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const db = readDb();

    let grievances = db.grievances;
    if (email) {
      const normalizedEmail = email.toLowerCase();
      grievances = grievances.filter(
        (g) => g.citizen.toLowerCase() === normalizedEmail,
      );
    }

    return NextResponse.json({ grievances });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not load grievances." },
      { status: 500 },
    );
  }
}
