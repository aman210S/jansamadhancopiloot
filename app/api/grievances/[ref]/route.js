import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const { ref } = await params;
    const db = readDb();
    const grievance = db.grievances.find(
      (g) => g.id.toLowerCase() === String(ref).toLowerCase(),
    );

    if (!grievance) {
      return NextResponse.json(
        { error: "No grievance found with this reference number." },
        { status: 404 },
      );
    }

    return NextResponse.json({ grievance });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not load the grievance." },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { ref } = await params;
    const body = await request.json();
    const db = readDb();

    const index = db.grievances.findIndex(
      (g) => g.id.toLowerCase() === String(ref).toLowerCase(),
    );
    if (index === -1) {
      return NextResponse.json(
        { error: "No grievance found with this reference number." },
        { status: 404 },
      );
    }

    const grievance = db.grievances[index];

    if (body.status) {
      grievance.status = body.status;
    }

    if (body.completeStep) {
      const stepIndex = grievance.steps.findIndex(
        (s) => s.label.toLowerCase() === String(body.completeStep).toLowerCase(),
      );
      if (stepIndex !== -1) {
        const now = new Date().toISOString();
        for (let i = 0; i <= stepIndex; i += 1) {
          grievance.steps[i].done = true;
          grievance.steps[i].at = grievance.steps[i].at || now;
        }
        grievance.status = body.status || grievance.steps[stepIndex].label;
      }
    }

    if (body.officer) {
      grievance.officer = body.officer;
    }

    writeDb(db);

    return NextResponse.json({ grievance });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not update the grievance." },
      { status: 500 },
    );
  }
}
