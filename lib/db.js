import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

let cache = null;

const defaultDb = {
  users: [],
  grievances: [],
  officers: [
    {
      id: "OFF-PRIYA",
      name: "Er. Priya Nair",
      role: "Zone 4 Nodal Engineer",
      zone: "Sadar Bazaar & Ward 1-6",
      password: "priya@123",
    },
    {
      id: "OFF-AMIT",
      name: "Amit Kapoor",
      role: "Nodal District Officer",
      zone: "Central District",
      password: "amit@123",
    },
    {
      id: "OFF-NISHA",
      name: "Nisha Singh",
      role: "Assistant Engineer, Roads",
      zone: "Main Road, Sector 1-8",
      password: "nisha@123",
    },
    {
      id: "OFF-ROHIT",
      name: "Rohit Bansal",
      role: "Assistant Engineer, Electrical Division",
      zone: "Sector 1-8 electrical works",
      password: "rohit@123",
    },
    {
      id: "OFF-MEERA",
      name: "Dr. Meera Shah",
      role: "District Health Grievance Officer",
      zone: "Central District facilities",
      password: "meera@123",
    },
  ],
  counters: { grievance: 1000 },
};

export function readDb() {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch (error) {
    cache = JSON.parse(JSON.stringify(defaultDb));
    writeDb(cache);
  }
  return cache;
}

export function writeDb(db) {
  cache = db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function nextGrievanceId() {
  const db = readDb();
  db.counters.grievance += 1;
  writeDb(db);
  return `CPG-2026-${String(db.counters.grievance).padStart(5, "0")}`;
}

export function findOfficerById(id) {
  const db = readDb();
  return db.officers.find((o) => o.id.toLowerCase() === String(id || "").toLowerCase());
}
