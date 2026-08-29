"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  Car,
  Check,
  ChevronRight,
  Clock3,
  Droplets,
  FileText,
  GraduationCap,
  HeartPulse,
  ImagePlus,
  Landmark,
  Languages,
  Lightbulb,
  LogIn,
  MapPin,
  Mic,
  Radio,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Trash2,
  Trees,
  Upload,
  UserRound,
  Volume2,
  Wifi,
  X,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const demos = [
  {
    label: "Demo Voice 1 · Hindi",
    text: "Hamare ilaake mein 2 hafte se paani ki pipe leak ho rahi hai, Sadar Bazaar Ward 4 mein paani bekar beha raha hai.",
    kind: "Water supply",
  },
  {
    label: "Demo Voice 2 · English",
    text: "The streetlights on Main Road, Sector 6, near the metro station have not been working for 10 days.",
    kind: "Street lighting",
  },
];

const seedTicket = {
  id: "CPG-2026-X8921",
  title: "Water pipeline leak at Sadar Bazaar Ward 4",
  date: "28 Aug 2026",
  officer: "Er. Priya Nair",
  status: "In Progress",
  category: "Water Supply",
  summary:
    "A continuous pipeline leak has wasted water in Sadar Bazaar Ward 4 for two weeks.",
};

const categories = [
  {
    id: "water",
    label: "Water & sanitation",
    hint: "Leaks, supply, drainage",
    icon: Droplets,
    tone: "blue",
    example:
      "There is a water pipe leak at Sadar Bazaar Ward 4. Water has been flowing for two weeks.",
  },
  {
    id: "roads",
    label: "Roads & transport",
    hint: "Potholes, traffic, buses",
    icon: Car,
    tone: "orange",
    example:
      "A large pothole on Main Road near the bus stand is dangerous for commuters.",
  },
  {
    id: "electricity",
    label: "Electricity & streetlights",
    hint: "Outages, unsafe wiring",
    icon: Lightbulb,
    tone: "amber",
    example:
      "The streetlights on Main Road, Sector 6, near the metro station have not been working for 10 days.",
  },
  {
    id: "cleanliness",
    label: "Cleanliness & waste",
    hint: "Garbage, public toilets",
    icon: Trash2,
    tone: "green",
    example:
      "Garbage has not been collected from our lane for a week and is attracting stray animals.",
  },
  {
    id: "health",
    label: "Health & welfare",
    hint: "Hospitals, schemes, services",
    icon: HeartPulse,
    tone: "red",
    example:
      "The primary health centre has not provided the essential medicines prescribed to patients.",
  },
  {
    id: "education",
    label: "Education & youth",
    hint: "Schools, scholarships",
    icon: GraduationCap,
    tone: "purple",
    example:
      "Our government school has not received the sanctioned scholarship amount for eligible students.",
  },
  {
    id: "revenue",
    label: "Revenue & land",
    hint: "Certificates, land records",
    icon: Landmark,
    tone: "indigo",
    example:
      "My application for an income certificate has been pending beyond the stated service timeline.",
  },
  {
    id: "safety",
    label: "Public safety",
    hint: "Unsafe places, civic hazards",
    icon: ShieldAlert,
    tone: "rose",
    example:
      "An open electrical junction box near the market is unsafe for children and pedestrians.",
  },
  {
    id: "rail",
    label: "Rail & public transit",
    hint: "Stations, accessibility",
    icon: TrainFront,
    tone: "teal",
    example:
      "The lift at the railway station has been non-functional, affecting elderly passengers.",
  },
  {
    id: "environment",
    label: "Environment & parks",
    hint: "Trees, pollution, parks",
    icon: Trees,
    tone: "emerald",
    example:
      "Construction debris is being dumped in the public park near our housing colony.",
  },
  {
    id: "municipal",
    label: "Other civic service",
    hint: "Property, licences, local bodies",
    icon: Building2,
    tone: "slate",
    example:
      "I need help with a delayed municipal service application in my ward.",
  },
];

const assistantSignals = [
  ["water", ["water", "leak", "pipe", "drain", "sewage", "paani"]],
  ["roads", ["road", "pothole", "traffic", "bus", "footpath", "sadak"]],
  [
    "electricity",
    [
      "electricity",
      "streetlight",
      "street light",
      "power",
      "transformer",
      "wiring",
      "bijli",
    ],
  ],
  ["cleanliness", ["garbage", "waste", "rubbish", "toilet", "clean", "kachra"]],
  ["health", ["health", "hospital", "doctor", "medicine", "clinic", "dawai"]],
  ["education", ["school", "scholarship", "student", "college", "teacher"]],
  ["revenue", ["land", "property", "certificate", "tax", "record", "revenue"]],
  ["safety", ["unsafe", "hazard", "accident", "danger", "fire", "crime"]],
  ["rail", ["railway", "train", "station", "metro", "platform", "lift"]],
  ["environment", ["tree", "park", "pollution", "debris", "environment"]],
];
const indianStates = ["andhra pradesh", "arunachal pradesh", "assam", "bihar", "chhattisgarh", "goa", "gujarat", "haryana", "himachal pradesh", "jharkhand", "karnataka", "kerala", "madhya pradesh", "maharashtra", "manipur", "meghalaya", "mizoram", "nagaland", "odisha", "punjab", "rajasthan", "sikkim", "tamil nadu", "telangana", "tripura", "uttar pradesh", "uttarakhand", "west bengal", "delhi", "jammu and kashmir", "ladakh", "puducherry"];

function Badge({ children, tone = "green" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-800 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Header({
  view,
  setView,
  language,
  setLanguage,
  user,
  officer,
  onLogoutUser,
  onLogoutOfficer,
}) {
  const router = useRouter();
  return (
    <header className="border-b border-stone-200 bg-[#fbfcf8]/95 px-4 py-3 backdrop-blur sm:px-7">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#126b48] text-white">
            <ShieldCheck size={23} />
          </div>
          <div>
            <div className="font-bold tracking-tight text-[#123d2b]">
              JanSamadhan <span className="text-[#d67828]">Copilot</span>
            </div>
            <div className="text-[10px] text-stone-500">
              Powered by OpenAI & Codex
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Badge tone="amber">
            <Radio size={11} /> MOCK DATA ENVIRONMENT
          </Badge>
          <Badge>
            <Wifi size={11} /> LOW-BANDWIDTH: ACTIVE
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/track"
            className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs font-bold text-[#172554]"
          >
            <Search size={14} /> <span className="hidden sm:block">Track</span>
          </Link>
          <select
            aria-label="Choose service language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="hidden rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs font-bold text-[#172554] sm:block"
          >
            <option>English</option>
            <option>हिंदी</option>
            <option>தமிழ்</option>
            <option>मराठी</option>
          </select>
          <div className="rounded-lg bg-stone-100 p-1 text-xs font-bold">
            <button
              onClick={() => setView("citizen")}
              className={`rounded-md px-2.5 py-1.5 ${view === "citizen" ? "bg-white text-[#172554] shadow-sm" : "text-stone-500"}`}
            >
              Citizen
            </button>
            <button
              onClick={() =>
                officer ? setView("officer") : router.push("/officer-login")
              }
              className={`rounded-md px-2.5 py-1.5 ${view === "officer" ? "bg-white text-[#172554] shadow-sm" : "text-stone-500"}`}
            >
              Officer
            </button>
          </div>
          {officer ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden text-xs font-bold text-[#123d2b] sm:block">
                {officer.name}
              </span>
              <button
                onClick={onLogoutOfficer}
                className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs font-bold text-stone-600"
              >
                Logout
              </button>
            </div>
          ) : user ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden text-xs font-bold text-[#123d2b] sm:block">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={onLogoutUser}
                className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs font-bold text-stone-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 rounded-lg bg-[#126b48] px-3 py-2 text-xs font-bold text-white"
            >
              <LogIn size={14} /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function Stage({ n, label, active, complete }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${complete ? "bg-[#126b48] text-white" : active ? "bg-[#f3ad52] text-[#4b2c0b]" : "bg-stone-200 text-stone-500"}`}
      >
        {complete ? <Check size={14} /> : n}
      </div>
      <span
        className={`hidden text-xs font-semibold sm:block ${active || complete ? "text-[#164631]" : "text-stone-400"}`}
      >
        {label}
      </span>
    </div>
  );
}

function Capture() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6">
      <div className="premium-hero mb-7 overflow-hidden rounded-3xl px-5 py-10 text-center sm:px-10">
        <Badge tone="amber">
          <Sparkles size={12} /> AI-ASSISTED GRIEVANCE
        </Badge>
        <h1 className="serif mt-3 text-3xl font-bold text-white sm:text-4xl">
          Every civic concern deserves a clear path.
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
          Select the service that best fits your issue. You will then open its
          detailed grievance form, map, and official routing page.
        </p>
      </div>
      <div className="mb-6">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="section-label">Service category</p>
            <h2 className="text-lg font-bold text-[#172554]">
              What would you like to raise?
            </h2>
          </div>
          <span className="hidden text-xs text-slate-500 sm:block">
            Choose a service to open its grievance form
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={`/raise/${item.id}`}
                className={`category-card category-${item.tone}`}
                aria-label={`Raise a ${item.label} grievance`}
              >
                <Icon size={19} />
                <span className="mt-3 block text-left text-xs font-bold leading-4">
                  {item.label}
                </span>
                <span className="mt-1 block text-left text-[10px] leading-4 opacity-75">
                  {item.hint}
                </span>
                <span className="mt-3 flex items-center gap-1 text-left text-[10px] font-extrabold">
                  Raise grievance <ArrowRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-600">
          <ShieldCheck className="mr-2 inline text-emerald-600" size={16} />
          <b>Privacy by design</b>
          <br />
          Only necessary details are collected.
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-600">
          <Languages className="mr-2 inline text-indigo-700" size={16} />
          <b>Inclusive access</b>
          <br />
          Voice, text and regional-language support.
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-600">
          <Clock3 className="mr-2 inline text-orange-600" size={16} />
          <b>Accountable resolution</b>
          <br />
          Transparent routing, SLA and escalation.
        </div>
      </div>
    </section>
  );
}

function Intake({ category, onBack, onContinue, initialDetails = "" }) {
  const addresses = [
    "Sadar Bazaar, Ward 4",
    "Main Road, Sector 6",
    "Nehru Colony, Ward 12",
    "Civil Lines, District Centre",
  ];
  const officers =
    category?.id === "health"
      ? [
          {
            name: "Dr. Meera Shah",
            role: "District Health Grievance Officer",
            zone: "Central District",
          },
          {
            name: "Anil Verma",
            role: "Public Health Programme Officer",
            zone: "Ward 1–12",
          },
        ]
      : category?.id === "electricity"
        ? [
            {
              name: "Rohit Bansal",
              role: "Assistant Engineer, Electrical Division",
              zone: "Sector 1–8",
            },
            {
              name: "Kavita Rao",
              role: "Executive Engineer, Street Lighting",
              zone: "Central District",
            },
          ]
        : [
            {
              name: "Er. Priya Nair",
              role: "Zone 4 Nodal Engineer",
              zone: "Sadar Bazaar & Ward 1–6",
            },
            {
              name: "Amit Kapoor",
              role: "Nodal District Officer",
              zone: "Central District",
            },
          ];
  const [address, setAddress] = useState(addresses[0]);
  const [details, setDetails] = useState(initialDetails);
  const [officer, setOfficer] = useState(officers[0]);
  const jurisdictionOfficer = (value) => {
    const normalized = value.toLowerCase();
    if (/sadar bazaar|ward 4|sector 6|main road/.test(normalized)) return officers[0];
    if (/nehru colony|ward 12|civil lines|district centre/.test(normalized)) return officers[1];
    return officers[1];
  };
  const updateAddress = (value) => {
    setAddress(value);
    const selected = jurisdictionOfficer(value);
    const state = indianStates.find((name) => value.toLowerCase().includes(name));
    setOfficer(state ? { ...selected, zone: `${state.replace(/\b\w/g, (letter) => letter.toUpperCase())} district jurisdiction` } : selected);
  };
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <button onClick={onBack} className="text-sm font-bold text-[#1e3a8a]">
        ← Back to services
      </button>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">{category?.label}</p>
          <h1 className="serif mt-1 text-3xl font-bold text-[#172554]">
            Pin the place. Tell us what happened.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            This helps route your grievance to the responsible official in the
            right local jurisdiction.
          </p>
        </div>
        <Badge>
          <ShieldCheck size={12} /> LOCATION-BASED ROUTING
        </Badge>
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-5">
          <div className="paper rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label">Incident location</p>
                <h2 className="font-bold">Select the affected area</h2>
              </div>
              <MapPin className="text-[#e26a22]" />
            </div>
            <div className="map-surface relative mt-4 h-64 overflow-hidden rounded-xl border border-indigo-100">
              <div className="map-road map-road-one" />
              <div className="map-road map-road-two" />
              <div className="absolute left-[12%] top-[13%] text-[10px] font-bold text-slate-500">
                RIVER ROAD
              </div>
              <div className="absolute right-[10%] bottom-[12%] text-[10px] font-bold text-slate-500">
                METRO LINE
              </div>
              {addresses.map((item, i) => (
                <button
                  key={item}
                  onClick={() => updateAddress(item)}
                  style={{
                    left: ["18%", "68%", "42%", "77%"][i],
                    top: ["42%", "24%", "70%", "68%"][i],
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 ${address === item ? "text-[#e26a22]" : "text-[#1e3a8a]"}`}
                  aria-label={`Select ${item}`}
                >
                  <MapPin fill="currentColor" size={29} />
                  <span className="sr-only">{item}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {addresses.map((item) => (
                <button
                  onClick={() => updateAddress(item)}
                  key={item}
                  className={`rounded-lg border px-3 py-2 text-left text-xs font-bold ${address === item ? "border-[#1e3a8a] bg-indigo-50 text-[#172554]" : "border-slate-200 text-slate-600"}`}
                >
                  <MapPin className="mr-1 inline" size={13} />
                  {item}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-xs font-bold text-slate-600">
              Or enter a precise landmark
              <input
                value={address}
                onChange={(e) => updateAddress(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-indigo-500"
              />
            </label>
          </div>
          <div className="paper rounded-2xl border border-slate-200 bg-white p-5">
            <p className="section-label">What happened?</p>
            <h2 className="font-bold">Explain the problem</h2>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={`Describe the ${category?.label.toLowerCase()} issue, how long it has continued, and who is affected…`}
              className="mt-3 min-h-36 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-500"
            />
            <p className="mt-2 text-xs text-slate-500">
              Tip: Include timing, safety impact, and anything already reported.
            </p>
          </div>
        </div>
        <aside className="paper h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <p className="section-label">Responsible officials</p>
          <h2 className="font-bold text-[#172554]">
            Your local resolution team
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Choose the officer who should receive the first routing
            recommendation.
          </p>
          <div className="mt-4 space-y-3">
            {officers.map((person) => (
              <button
                key={person.name}
                onClick={() => setOfficer(person)}
                className={`w-full rounded-xl border p-4 text-left ${officer.name === person.name ? "border-[#1e3a8a] bg-indigo-50" : "border-slate-200 hover:bg-slate-50"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[#172554] text-white">
                    <UserRound size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#172554]">
                      {person.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {person.role}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-[#e26a22]">
                      Responsible for: {person.zone}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-900">
            <Check className="mr-1 inline" size={14} />
            <b>Routing assurance:</b> the final department and officer are
            confirmed after AI triage.
          </div>
        </aside>
      </div>
      <button
        disabled={details.trim().length < 12 || !address.trim()}
        onClick={() => onContinue(details.trim(), category, officer, address)}
        className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-[#e26a22] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue with this location <ArrowRight size={17} />
      </button>
    </section>
  );
}

function Processing() {
  const stages = [
    "Transcribing local dialect",
    "Extracting location & entities",
    "Running vision analysis",
    "Auto-routing department",
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const x = setInterval(() => setStep((s) => s + 1), 550);
    return () => clearInterval(x);
  }, []);
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-md flex-col justify-center px-5">
      <div className="paper rounded-2xl border border-stone-200 bg-white p-7">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-[#126b48]">
          <Bot size={28} className="animate-pulse" />
        </div>
        <h2 className="serif mt-5 text-2xl font-bold">
          Your Copilot is working
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Making your grievance precise and actionable.
        </p>
        <div className="mt-6 space-y-4">
          {stages.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-3 text-sm ${i <= step ? "text-[#18533a]" : "text-stone-400"}`}
            >
              <div
                className={`grid h-6 w-6 place-items-center rounded-full ${i < step ? "bg-[#126b48] text-white" : i === step ? "bg-amber-100 text-amber-700" : "bg-stone-100"}`}
              >
                {i < step ? (
                  <Check size={14} />
                ) : i === step ? (
                  <span className="h-2 w-2 animate-ping rounded-full bg-amber-600" />
                ) : (
                  i + 1
                )}
              </div>
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Draft({
  text,
  photo,
  category,
  onConfirm,
  onBack,
  user,
  submitting,
}) {
  const street =
    category?.id === "electricity" || /street|light|metro/i.test(text);
  const issue =
    category?.id === "water" || !street
      ? "Water pipeline leakage"
      : "Non-functional streetlights";
  const route = street
    ? "Ministry of Housing & Urban Affairs → Municipal Corporation → Electrical Division Officer"
    : category?.id === "health"
      ? "Ministry of Health & Family Welfare → District Health Office → Grievance Officer"
      : "Ministry of Jal Shakti → Delhi Jal Board → Zone 4 Nodal Engineer";
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <button
        onClick={onBack}
        className="mb-4 text-sm font-bold text-[#1e3a8a]"
      >
        ← Edit my report
      </button>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge>
            <Sparkles size={12} /> AI TRIAGE COMPLETE
          </Badge>
          <h1 className="serif mt-2 text-3xl font-bold text-[#172554]">
            Ready for your review
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            We translated your words into an official grievance for{" "}
            {category?.label || "this civic service"}.
          </p>
        </div>
        <Badge tone="amber">
          <AlertTriangle size={13} /> URGENCY: HIGH · 4/5
        </Badge>
      </div>
      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-4">
          <div className="paper rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Auto-routed to
            </p>
            <div className="mt-3 flex gap-3">
              <MapPin className="mt-1 shrink-0 text-[#e26a22]" />
              <div className="text-sm font-bold leading-6 text-[#172554]">
                {route.split(" → ").map((x, i) => (
                  <div key={x}>
                    {x}
                    {i < 2 && (
                      <ChevronRight
                        className="inline text-slate-300"
                        size={14}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-[#172554] p-5 text-white">
            <div className="flex items-center gap-2 text-sm font-bold">
              <ImagePlus size={17} /> Vision verification
            </div>
            <p className="mt-2 text-xs leading-5 text-indigo-100">
              {photo
                ? `${photo} analysed: visual evidence supports ${issue.toLowerCase()}.`
                : "No photo attached. Your voice statement is sufficient to submit."}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-4/5 rounded-full bg-[#f3ad52]" />
            </div>
          </div>
        </div>
        <article className="paper rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex gap-2">
              <FileText className="text-[#1e3a8a]" />
              <span className="font-bold">Structured grievance draft</span>
            </div>
            <Badge tone="slate">EDITABLE</Badge>
          </div>
          <div className="mt-5 space-y-5 text-sm leading-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Subject
              </p>
              <p className="font-bold">
                Urgent request for rectification: {issue} at{" "}
                {street ? "Main Road, Sector 6" : "Sadar Bazaar Ward 4"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Incident summary
              </p>
              <p>
                I wish to bring to the notice of the concerned authority that{" "}
                {street
                  ? "streetlights near the metro station have remained non-functional for ten days, creating an unsafe public corridor."
                  : "a water pipeline has been continuously leaking for approximately two weeks, causing significant water wastage and inconvenience to residents."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Location / landmark
                </p>
                <p>
                  {street
                    ? "Main Road, Sector 6, near Metro Station"
                    : "Sadar Bazaar, Ward 4"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Relevant standard
                </p>
                <p>Citizen Charter & public utility maintenance obligations</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Requested action
              </p>
              <p>
                Kindly conduct an inspection and undertake the necessary repair
                on priority. Please provide a status update through the CPGRAMS
                portal.
              </p>
            </div>
          </div>
        </article>
      </div>
      {!user && (
        <p className="mx-auto mt-5 max-w-2xl rounded-xl bg-amber-50 px-4 py-3 text-center text-xs font-bold text-amber-800">
          You need to <Link href="/login" className="underline">log in</Link>{" "}
          to submit your grievance and receive a reference number for tracking.
        </p>
      )}
      <button
        onClick={onConfirm}
        disabled={submitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#172554] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#0f1c45] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          "Submitting…"
        ) : (
          <>
            <Send size={17} /> {user ? "Confirm & Submit Grievance" : "Log in to Submit Grievance"}
          </>
        )}
      </button>
    </section>
  );
}

function Tracking({ ticket, breach, onBreach, onNew }) {
  const router = useRouter();
  const steps = ["Submitted", "Routed", "Under Inspection", "Resolved"];
  const current = breach ? 2 : 1;
  const [trackRef, setTrackRef] = useState("");
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <Badge tone={breach ? "red" : "green"}>
          {breach ? <AlertTriangle size={12} /> : <Check size={12} />}{" "}
          {breach ? "SLA BREACH — ESCALATED" : "GRIEVANCE REGISTERED"}
        </Badge>
        <h1 className="serif mt-3 text-3xl font-bold text-[#163d2d]">
          Your grievance is in motion.
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          We’ll keep every step transparent.
        </p>
      </div>
      <div className="paper mt-7 rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-3 border-b border-stone-100 pb-5 sm:flex-row">
          <div>
            <p className="text-xs text-stone-500">Grievance ID · Reference</p>
            <p className="text-lg font-bold text-[#126b48]">{ticket.id}</p>
            <Link
              href={`/track?ref=${encodeURIComponent(ticket.id)}`}
              className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#1e3a8a]"
            >
              <Search size={12} /> Track this reference
            </Link>
          </div>
          <div>
            <p className="text-xs text-stone-500">Assigned officer</p>
            <p className="font-bold">
              {breach ? "Nodal District Officer · Amit Kapoor" : ticket.officer}
            </p>
          </div>
          <Badge tone={breach ? "red" : "amber"}>
            {breach ? "Escalated" : ticket.status || "In Progress"}
          </Badge>
        </div>
        <div className="my-8 grid grid-cols-4">
          {steps.map((s, i) => (
            <div className="relative text-center" key={s}>
              {i < 3 && (
                <div
                  className={`absolute left-1/2 top-3 h-0.5 w-full ${i < current ? "bg-[#126b48]" : "bg-stone-200"}`}
                />
              )}
              <div
                className={`relative z-10 mx-auto grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${i <= current ? "bg-[#126b48] text-white" : "bg-stone-200 text-stone-500"}`}
              >
                {i < current ? <Check size={14} /> : i + 1}
              </div>
              <p
                className={`mt-2 text-[10px] font-bold sm:text-xs ${i <= current ? "text-[#174530]" : "text-stone-400"}`}
              >
                {s}
              </p>
            </div>
          ))}
        </div>
        <div
          className={`rounded-xl p-4 ${breach ? "bg-rose-50" : "bg-amber-50"}`}
        >
          <div className="flex items-start gap-3">
            <Clock3 className={breach ? "text-rose-600" : "text-amber-700"} />
            <div>
              <p className="font-bold">
                {breach ? "Resolution SLA breached" : "21-day resolution SLA"}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {breach
                  ? "The ticket has been auto-escalated under DARPG guidelines. A nodal officer has been notified."
                  : "20 days, 14 hours remaining for mandatory resolution."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="paper mt-5 rounded-2xl border border-stone-200 bg-white p-5">
        <p className="text-xs font-bold text-stone-500">
          Track another grievance by reference number
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (trackRef.trim()) {
              router.push(`/track?ref=${encodeURIComponent(trackRef.trim())}`);
            }
          }}
          className="mt-2 flex gap-2"
        >
          <input
            value={trackRef}
            onChange={(e) => setTrackRef(e.target.value)}
            placeholder="e.g. CPG-2026-01001"
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold uppercase outline-none focus:border-indigo-500"
          />
          <button
            disabled={!trackRef.trim()}
            className="rounded-lg bg-[#126b48] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            Track
          </button>
        </form>
      </div>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          onClick={onBreach}
          disabled={breach}
          className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 disabled:opacity-50"
        >
          <AlertTriangle className="mr-1 inline" size={15} /> Simulate SLA
          Breach
        </button>
        <button
          onClick={onNew}
          className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#126b48]"
        >
          File another grievance
        </button>
      </div>
    </section>
  );
}

function Officer({ tickets, onOpen, officer, onLogout, loading }) {
  const router = useRouter();
  if (!officer) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <Badge tone="red">
          <ShieldAlert size={12} /> RESTRICTED ACCESS
        </Badge>
        <h1 className="serif mt-3 text-3xl font-bold text-[#172554]">
          Officer login required
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
          This window is reserved for authorised grievance officers. Please log
          in with your Officer ID and password.
        </p>
        <button
          onClick={() => router.push("/officer-login")}
          className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-bold text-white"
        >
          <LogIn size={16} /> Login as Officer
        </button>
      </section>
    );
  }
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <Badge>
            <UserRound size={12} /> OFFICER WORKSPACE
          </Badge>
          <h1 className="serif mt-2 text-3xl font-bold text-[#163d2d]">
            Resolution queue
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            AI-ranked cases requiring attention today. Logged in as{" "}
            <b>{officer.name}</b> · {officer.role}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-[#126b48]">
            {tickets.length} active tickets
          </div>
          <button
            onClick={onLogout}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-600"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="paper mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="grid grid-cols-[1.4fr_.7fr_.8fr_auto] gap-3 border-b border-stone-100 bg-stone-50 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 sm:px-6">
          <span>Grievance</span>
          <span>Priority</span>
          <span className="hidden sm:block">Status</span>
          <span></span>
        </div>
        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-stone-500">
            Loading grievances…
          </div>
        ) : tickets.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-stone-500">
            No active grievances yet.
          </div>
        ) : (
          tickets.map((t, i) => (
            <button
              onClick={() => onOpen(t)}
              key={t.id}
              className="grid w-full grid-cols-[1.4fr_.7fr_.8fr_auto] items-center gap-3 border-b border-stone-100 px-4 py-4 text-left hover:bg-emerald-50/50 sm:px-6"
            >
              <div>
                <p className="text-sm font-bold">{t.title}</p>
                <p className="mt-1 text-xs text-stone-500">
                  {t.id} · {t.date} · {t.location}
                </p>
              </div>
              <Badge tone="amber">
                {t.priority === "LOW" ? "LOW" : "HIGH"}
              </Badge>
              <span className="hidden text-xs font-semibold text-[#126b48] sm:block">
                {t.status}
              </span>
              <ChevronRight className="text-stone-400" size={18} />
            </button>
          ))
        )}
      </div>
    </section>
  );
}

function Drawer({ ticket, close, onUpdate }) {
  const [approved, setApproved] = useState(false);
  const [rerouted, setRerouted] = useState(false);
  const approve = () => {
    setApproved(true);
    onUpdate(ticket.id, {
      status: "Under Inspection",
      completeStep: "Under Inspection",
    });
  };
  const reroute = () => {
    setRerouted(true);
    onUpdate(ticket.id, { status: "Routed" });
  };
  return (
    <>
      <div className="fixed inset-0 z-20 bg-black/20" onClick={close} />
      <aside className="drawer fixed right-0 top-0 z-30 h-full w-full max-w-xl overflow-y-auto bg-[#fbfcf8] p-5 shadow-2xl sm:p-7">
        <div className="flex justify-between">
          <div>
            <Badge>
              <Bot size={12} /> AI RESOLUTION COPILOT
            </Badge>
            <h2 className="serif mt-2 text-2xl font-bold">{ticket.id}</h2>
          </div>
          <button
            onClick={close}
            className="grid h-9 w-9 place-items-center rounded-full bg-stone-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-[#164b35] p-5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              AI issue summary
            </p>
            <p className="mt-2 text-sm leading-6">
              {ticket.summary || ticket.details}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="font-bold">Suggested official action plan</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
              <li>1. Dispatch field inspection within 24 hours.</li>
              <li>2. Verify public-safety and utility impact on site.</li>
              <li>
                3. Complete repair work and upload geotagged closure evidence.
              </li>
            </ol>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="font-bold">Draft response to citizen</p>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Dear Citizen, your grievance has been acknowledged and assigned
              for an urgent field inspection. The concerned division will
              undertake corrective action and update you through this portal.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={approve}
            className="rounded-xl bg-[#126b48] px-4 py-3 text-sm font-bold text-white"
          >
            {approved ? (
              <>
                <Check className="mr-1 inline" size={16} /> Citizen notified
              </>
            ) : (
              "Approve Action & Notify"
            )}
          </button>
          <button
            onClick={reroute}
            className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-700"
          >
            {rerouted ? (
              <>
                <Check className="mr-1 inline text-emerald-600" size={16} />{" "}
                Routing request queued
              </>
            ) : (
              "Re-route Department"
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

function CitizenGuide({ onUseDraft }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Namaste! I’m Sahayak AI. Tell me what happened in your own words—I’ll help you turn it into a complete grievance.",
    },
  ]);
  const replyTo = (value) => {
    const lower = value.toLowerCase().trim();
    const greeting =
      /^(hi|hello|hey|namaste|good morning|good evening)[!. ]*$/i.test(lower);
    if (greeting) {
      setMessages((current) => [
        ...current,
        { role: "user", text: value },
        {
          role: "ai",
          text: "Namaste! Tell me about the civic problem, where it happened, and how long it has continued.",
        },
      ]);
      setQuery("");
      return;
    }
    const signal = assistantSignals.find(([, words]) =>
      words.some((word) => lower.includes(word)),
    );
    const matched = signal
      ? categories.find((category) => category.id === signal[0])
      : null;
    if (!matched) {
      setMessages((current) => [
        ...current,
        { role: "user", text: value },
        {
          role: "ai",
          text: "I can help with water, roads, electricity, cleanliness, health, education, land, safety, transit, and parks. Which civic problem are you reporting?",
        },
      ]);
      setQuery("");
      return;
    }
    const draft = value.length > 20 ? value : matched.example;
    const missing = [
      !/(at|near|road|ward|sector|colony|market|station|school|hospital|lane)/i.test(
        value,
      ) && "exact location",
      !/(day|week|month|hour|today|yesterday|since|weeks|months)/i.test(
        value,
      ) && "duration",
      !/(danger|unsafe|risk|impact|affect|waste|blocked)/i.test(value) &&
        "impact or safety risk",
    ].filter(Boolean);
    const followUp = missing.length
      ? ` Please add ${missing.join(", ")}.`
      : " Your report has the key details to begin routing.";
    setMessages((current) => [
      ...current,
      { role: "user", text: value },
      {
        role: "ai",
        text: `This sounds like a ${matched.label.toLowerCase()} issue.${followUp}`,
        category: matched,
        draft,
      },
    ]);
    setQuery("");
  };
  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {open && (
        <div className="guide-panel paper mb-3 w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-indigo-100 bg-white sm:w-[390px]">
          <div className="flex items-center justify-between bg-[#172554] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#e26a22]">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">Sahayak AI</p>
                <p className="text-[10px] text-indigo-200">
                  Your grievance guide · Demo AI
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <X size={18} />
            </button>
          </div>
          <div className="max-h-[390px] space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "ai" ? "flex gap-2" : "flex justify-end"
                }
              >
                {message.role === "ai" && (
                  <Bot size={16} className="mt-1 shrink-0 text-[#e26a22]" />
                )}
                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-5 ${message.role === "ai" ? "rounded-tl-sm bg-white text-slate-700 shadow-sm" : "rounded-tr-sm bg-[#1e3a8a] text-white"}`}
                >
                  <p>{message.text}</p>
                  {message.draft && (
                    <button
                      onClick={() => {
                        onUseDraft(message.draft, message.category);
                        setOpen(false);
                      }}
                      className="mt-3 w-full rounded-lg bg-[#e26a22] px-3 py-2 text-xs font-bold text-white"
                    >
                      Use this draft in my complaint{" "}
                      <ArrowRight className="ml-1 inline" size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {["Water leak", "Road pothole", "Streetlight not working"].map(
                (prompt) => (
                  <button
                    key={prompt}
                    onClick={() => replyTo(prompt)}
                    className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-[#1e3a8a]"
                  >
                    {prompt}
                  </button>
                ),
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) replyTo(query.trim());
              }}
              className="flex gap-2"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your problem…"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500"
              />
              <button
                className="grid h-9 w-9 place-items-center rounded-lg bg-[#172554] text-white"
                aria-label="Send"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-[#172554] px-4 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-200 transition hover:bg-[#0f1c45]"
      >
        <Bot size={19} />
        {open ? "Close guide" : "Ask Sahayak AI"}
      </button>
    </div>
  );
}

export default function App() {
  const {
    user,
    officer,
    loading: authLoading,
    logoutUser,
    logoutOfficer,
  } = useAuth();
  const router = useRouter();
  const [view, setView] = useState("citizen"),
    [language, setLanguage] = useState("English"),
    [flow, setFlow] = useState("capture"),
    [input, setInput] = useState({}),
    [ticket, setTicket] = useState(seedTicket),
    [breach, setBreach] = useState(false),
    [tickets, setTickets] = useState([]),
    [ticketLoading, setTicketLoading] = useState(false),
    [drawer, setDrawer] = useState(null),
    [guidePrefill, setGuidePrefill] = useState(null),
    [selectedCategory, setSelectedCategory] = useState(null),
    [submitting, setSubmitting] = useState(false),
    [notice, setNotice] = useState("");

  const loadTickets = useCallback(async () => {
    setTicketLoading(true);
    try {
      const res = await fetch("/api/grievances");
      const data = await res.json();
      if (res.ok) setTickets(data.grievances || []);
    } catch {
      // ignore network errors
    } finally {
      setTicketLoading(false);
    }
  }, []);

  useEffect(() => {
    if (officer) {
      setView("officer");
      loadTickets();
    }
  }, [officer, loadTickets]);

  useEffect(() => {
    if (view === "officer" && officer) {
      loadTickets();
    }
  }, [view, officer, loadTickets]);

  const process = (text, photo, category, officer, location) => {
    setInput({ text, photo, category, officer, location });
    setFlow("process");
    setTimeout(() => setFlow("draft"), 2450);
  };

  const confirm = async () => {
    if (!user) {
      setNotice("Please log in first to submit your grievance.");
      window.setTimeout(() => router.push("/login"), 1500);
      return;
    }
    setSubmitting(true);
    try {
      const street =
        input.category?.id === "electricity" ||
        /street|light|metro/i.test(input.text || "");
      const title = street
        ? "Streetlights non-functional near Main Road"
        : input.category?.label || "Civic service grievance";
      const category = street
        ? "Street Lighting"
        : input.category?.label || "Water Supply";
      const mappedOfficer =
        input.officer?.name || input.officer?.[0] || seedTicket.officer;
      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          details: input.text || "",
          location: input.location || "Sadar Bazaar, Ward 4",
          officerName: mappedOfficer,
          userEmail: user.email,
          userName: user.name,
          photo: input.photo || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit.");
      setTicket(data.grievance);
      setFlow("tracking");
      if (officer) {
        loadTickets();
      }
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateGrievance = async (ref, payload) => {
    try {
      const res = await fetch(`/api/grievances/${ref}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setTickets((prev) =>
          prev.map((t) => (t.id === ref ? data.grievance : t)),
        );
        setTicket((prev) => (prev?.id === ref ? data.grievance : prev));
      }
    } catch {
      // ignore network errors
    }
  };

  const useGuideDraft = (text, category) => {
    setView("citizen");
    setSelectedCategory(category);
    setGuidePrefill({ text, category, updatedAt: Date.now() });
    setFlow("intake");
  };

  const handleLogoutUser = () => {
    logoutUser();
    setView("citizen");
    setNotice("");
  };

  const handleLogoutOfficer = () => {
    logoutOfficer();
    setView("citizen");
    setTickets([]);
    setNotice("");
  };

  return (
    <main className="min-h-screen">
      <Header
        {...{ view, setView, language, setLanguage }}
        user={user}
        officer={officer}
        onLogoutUser={handleLogoutUser}
        onLogoutOfficer={handleLogoutOfficer}
      />
      {notice && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-bold text-white shadow-xl">
          {notice}
        </div>
      )}
      {view === "officer" ? (
        <Officer
          tickets={tickets}
          onOpen={setDrawer}
          officer={officer}
          onLogout={handleLogoutOfficer}
          loading={ticketLoading || authLoading}
        />
      ) : (
        <>
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 pt-5">
            <Stage
              n="1"
              label="Tell us"
              active={
                flow === "capture" || flow === "intake" || flow === "process"
              }
              complete={["draft", "tracking"].includes(flow)}
            />
            <div className="h-px flex-1 bg-slate-200" />
            <Stage
              n="2"
              label="Review"
              active={flow === "draft"}
              complete={flow === "tracking"}
            />
            <div className="h-px flex-1 bg-slate-200" />
            <Stage n="3" label="Track" active={flow === "tracking"} />
          </div>
          {flow === "capture" && <Capture />}{" "}
          {flow === "intake" && (
            <Intake
              category={selectedCategory}
              initialDetails={guidePrefill?.text || ""}
              onBack={() => setFlow("capture")}
              onContinue={(text, category, officer, location) =>
                process(text, "", category, officer, location)
              }
            />
          )}{" "}
          {flow === "process" && <Processing />}{" "}
          {flow === "draft" && (
            <Draft
              {...input}
              onConfirm={confirm}
              onBack={() => setFlow("intake")}
              user={user}
              submitting={submitting}
            />
          )}{" "}
          {flow === "tracking" && (
            <Tracking
              ticket={ticket}
              breach={breach}
              onBreach={() => setBreach(true)}
              onNew={() => {
                setBreach(false);
                setFlow("capture");
              }}
            />
          )}
        </>
      )}
      {drawer && (
        <Drawer
          ticket={drawer}
          close={() => setDrawer(null)}
          onUpdate={updateGrievance}
        />
      )}
      <CitizenGuide onUseDraft={useGuideDraft} />
    </main>
  );
}
