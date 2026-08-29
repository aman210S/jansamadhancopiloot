"use client";

import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Bookmark,
  Check,
  Clock3,
  ExternalLink,
  ImagePlus,
  LocateFixed,
  MapPin,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const services = {
  water: {
    label: "Water & sanitation",
    prompt:
      "Describe the leak, supply disruption, drainage issue, duration, and impact on residents.",
    officers: [
      [
        "Er. Priya Nair",
        "Zone 4 Nodal Engineer",
        "Water supply, drainage & sanitation · Ward 1–6",
      ],
      ["Amit Kapoor", "Nodal District Officer", "Central District oversight"],
    ],
  },
  roads: {
    label: "Roads & transport",
    prompt:
      "Describe the road, junction, route, duration, and any accident or traffic risk.",
    officers: [
      ["Nisha Singh", "Assistant Engineer, Roads", "Main Road, Sector 1–8"],
      [
        "Vikram Joshi",
        "Traffic Planning Officer",
        "Central District corridors",
      ],
    ],
  },
  electricity: {
    label: "Electricity & streetlights",
    prompt:
      "Describe the affected lights or power issue, exact pole/landmark, duration, and safety impact.",
    officers: [
      [
        "Rohit Bansal",
        "Assistant Engineer, Electrical Division",
        "Sector 1–8 electrical works",
      ],
      [
        "Kavita Rao",
        "Executive Engineer, Street Lighting",
        "Central District lighting network",
      ],
    ],
  },
  cleanliness: {
    label: "Cleanliness & waste",
    prompt:
      "Describe the waste or sanitation concern, how long it has persisted, and its health impact.",
    officers: [
      ["Sana Khan", "Sanitary Inspector", "Ward 1–6"],
      ["Manoj Tiwari", "Deputy Commissioner, Sanitation", "Central District"],
    ],
  },
  health: {
    label: "Health & welfare",
    prompt:
      "Describe the health service or scheme concern, facility, date, and effect on the citizen.",
    officers: [
      [
        "Dr. Meera Shah",
        "District Health Grievance Officer",
        "Central District facilities",
      ],
      ["Anil Verma", "Public Health Programme Officer", "Ward 1–12"],
    ],
  },
  education: {
    label: "Education & youth",
    prompt:
      "Describe the school, scholarship, service, dates, and the student impact.",
    officers: [
      [
        "Ritu Malhotra",
        "District Education Officer",
        "Government schools · Central District",
      ],
      ["Arun Kumar", "Scholarship Nodal Officer", "Ward 1–12"],
    ],
  },
  revenue: {
    label: "Revenue & land",
    prompt:
      "Describe the application, property or record, reference number, and pending duration.",
    officers: [
      ["S. K. Mehta", "Tehsildar", "Central District revenue services"],
      ["Pooja Iyer", "Land Records Nodal Officer", "Ward 1–12"],
    ],
  },
  safety: {
    label: "Public safety",
    prompt: "Describe the hazard, exact location, people at risk, and urgency.",
    officers: [
      ["Rakesh Sinha", "Civic Safety Officer", "Central District"],
      ["Neha Gupta", "Emergency Coordination Officer", "Ward 1–12"],
    ],
  },
  rail: {
    label: "Rail & public transit",
    prompt:
      "Describe the station, route, accessibility issue, date/time, and affected passengers.",
    officers: [
      ["P. D. Rao", "Station Facilities Manager", "Central transit hub"],
      [
        "Farah Ali",
        "Passenger Accessibility Officer",
        "District rail services",
      ],
    ],
  },
  environment: {
    label: "Environment & parks",
    prompt:
      "Describe the environmental issue, its location, duration, and visible impact.",
    officers: [
      ["Ananya Bose", "Environmental Engineer", "Central District"],
      ["Dev Arora", "Parks & Horticulture Officer", "Ward 1–12"],
    ],
  },
  municipal: {
    label: "Other civic service",
    prompt:
      "Describe the service, application/reference number, location, and how long it has been pending.",
    officers: [
      [
        "Amit Kapoor",
        "Nodal District Officer",
        "Central District civic services",
      ],
      ["Pallavi Jain", "Municipal Service Officer", "Ward 1–12"],
    ],
  },
};

const locations = [
  "Sadar Bazaar, Ward 4",
  "Main Road, Sector 6",
  "Nehru Colony, Ward 12",
  "Civil Lines, District Centre",
];
const indianStates = ["andhra pradesh", "arunachal pradesh", "assam", "bihar", "chhattisgarh", "goa", "gujarat", "haryana", "himachal pradesh", "jharkhand", "karnataka", "kerala", "madhya pradesh", "maharashtra", "manipur", "meghalaya", "mizoram", "nagaland", "odisha", "punjab", "rajasthan", "sikkim", "tamil nadu", "telangana", "tripura", "uttar pradesh", "uttarakhand", "west bengal", "delhi", "jammu and kashmir", "ladakh", "puducherry"];
const facilityHighlights = {
  water: ["Water treatment plant", "Community water point", "Drainage pumping station"],
  roads: ["Road maintenance depot", "Bus terminal", "Traffic control centre"],
  electricity: ["Electrical division office", "Power substation", "Streetlight control room"],
  cleanliness: ["Waste collection centre", "Material recovery facility", "Public sanitation block"],
  health: ["District hospital", "Primary health centre", "Welfare clinic"],
  education: ["Government school", "Public college", "Student support centre"],
  revenue: ["District collectorate", "Tehsil office", "Land records centre"],
  safety: ["Police station", "Fire station", "Emergency response centre"],
  rail: ["Railway station", "Metro station", "Bus interchange"],
  environment: ["City park", "Urban forest", "Pollution monitoring station"],
  municipal: ["Municipal office", "Citizen service centre", "Ward office"],
};
export default function RaiseGrievance({ params }) {
  const { category } = use(params);
  const service = services[category] || services.municipal;
  const facilities = facilityHighlights[category] || facilityHighlights.municipal;
  const [address, setAddress] = useState(locations[0]);
  const [details, setDetails] = useState("");
  const [officer, setOfficer] = useState(service.officers[0]);
  const [submitted, setSubmitted] = useState(false);
  const [point, setPoint] = useState({ x: 50, y: 50 });
  const [coordinates, setCoordinates] = useState({ latitude: 18.511801, longitude: 73.875195 });
  const [mapCenter, setMapCenter] = useState(`${locations[0]}, India`);
  const [photo, setPhoto] = useState("");
  const [locationSaved, setLocationSaved] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const mapRef = useRef(null);
  const [pinMode, setPinMode] = useState(false);
  const mapQuery = mapCenter;
  const updateOfficerForAddress = (value) => {
    const normalized = value.toLowerCase();
    const localZone = /sadar bazaar|ward 4|sector 6|main road/.test(normalized);
    const state = indianStates.find((name) => normalized.includes(name));
    const selected = localZone ? service.officers[0] : service.officers[1];
    setOfficer(state && !localZone ? [selected[0], selected[1], `${state.replace(/\b\w/g, (letter) => letter.toUpperCase())} district jurisdiction`] : selected);
  };
  useEffect(() => {
    updateOfficerForAddress(address);
  }, [address]);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.startsWith("Pinned location") || address.startsWith("Current location") ? `${coordinates.latitude},${coordinates.longitude}` : `${address}, India`)}`;
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported by this browser.");
      return;
    }
    setLocationStatus("Finding your location...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latitude = Number(coords.latitude.toFixed(6));
        const longitude = Number(coords.longitude.toFixed(6));
        setCoordinates({ latitude, longitude });
        setAddress(`Current location (${latitude}, ${longitude})`);
        setMapCenter(`${latitude},${longitude}`);
        updateOfficerForAddress("Current location");
        setLocationStatus("Current location selected.");
      },
      (error) => setLocationStatus(error.code === 1 ? "Allow location access in your browser, then try again. Your address was kept." : "We could not find your location. Your address was kept; use the pin or enter it manually."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };
  const movePoint = (event) => {
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = Math.round(((event.clientX - bounds.left) / bounds.width) * 100);
    const y = Math.round(((event.clientY - bounds.top) / bounds.height) * 100);
    setPoint({
      x,
      y,
    });
    const latitude = Number((18.531 - y * 0.00038).toFixed(6));
    const longitude = Number((73.860 + x * 0.00030).toFixed(6));
    setCoordinates({ latitude, longitude });
    setAddress(`Pinned location (${latitude}, ${longitude})`);
    updateOfficerForAddress("Pinned location");
  };
  const recenterMap = (event) => {
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = Math.round(((event.clientX - bounds.left) / bounds.width) * 100);
    const y = Math.round(((event.clientY - bounds.top) / bounds.height) * 100);
    setMapCenter(`${(18.531 - y * 0.00038).toFixed(6)},${(73.860 + x * 0.00030).toFixed(6)}`);
  };
  const saveLocation = () => {
    localStorage.setItem("jan-samadhan-location", JSON.stringify({ address, latitude: coordinates.latitude, longitude: coordinates.longitude }));
    setLocationSaved(true);
  };
  if (submitted)
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="paper mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Check size={28} />
          </div>
          <p className="section-label mt-5">GRIEVANCE PREPARED</p>
          <h1 className="serif mt-2 text-3xl font-bold text-[#172554]">
            Your report is ready for review.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The selected location and responsible officer have been attached to
            your {service.label.toLowerCase()} grievance.
          </p>
          <div className="mt-6 rounded-xl bg-indigo-50 p-4 text-left text-sm text-[#172554]">
            <b>Routing recommendation</b>
            <br />
            {officer[0]} · {officer[1]}
            <br />
            <span className="text-slate-500">
              {address} · {coordinates.latitude}° N, {coordinates.longitude}° E
            </span>
            {photo && (
              <>
                <br />
                <span className="text-slate-500">Photo: {photo}</span>
              </>
            )}
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-bold text-white"
          >
            Return to services <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-[#1e3a8a]"
          >
            <ArrowLeft size={17} /> All services
          </Link>
          <span className="text-xs font-bold text-slate-500">
            JanSamadhan Copilot
          </span>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label">Detailed grievance form</p>
            <h1 className="serif mt-1 text-3xl font-bold text-[#172554]">
              {service.label}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Point out the location, explain the concern, and see the officials
              responsible for resolving it.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
            <ShieldCheck size={14} /> Secure routing
          </span>
        </div>
        <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="space-y-5">
            <div className="paper rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label">Incident location</p>
                  <h2 className="font-bold text-[#172554]">
                    Pin the affected place
                  </h2>
                </div>
                <MapPin className="text-[#e26a22]" />
              </div>
              <div ref={mapRef} className="relative mt-4 h-72 overflow-hidden rounded-xl border border-slate-200">
                <div className="map-surface absolute inset-0 flex items-center justify-center"><span className="rounded-lg bg-white/90 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">India map loading...</span></div>
                <iframe title="Google Maps location" src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} className="relative z-[1] h-full w-full bg-white" loading="eager" />
                <div className="pointer-events-none absolute inset-0 z-[2]">
                  {facilities.map((facility, index) => <span key={facility} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-red-700 shadow-md" style={{ left: ["24%", "52%", "76%"][index], top: ["28%", "62%", "38%"][index] }}><MapPin size={12} fill="currentColor" />{facility}</span>)}
                </div>
                {pinMode && <button type="button" onDoubleClick={(event) => { movePoint(event); recenterMap(event); }} className="absolute inset-0 z-10 h-full w-full cursor-crosshair" aria-label="Double tap the map to place the pin" />}
                <button type="button" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); movePoint(event); }} onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && movePoint(event)} onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }} onPointerCancel={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }} className="absolute z-20 grid h-12 w-12 -translate-x-1/2 -translate-y-full place-items-end touch-none cursor-grab text-red-600 drop-shadow-md active:cursor-grabbing" style={{ left: `${point.x}%`, top: `${point.y}%` }} aria-label="Drag pin to update the location"><MapPin fill="currentColor" size={28} /></button>
              </div>
              <button type="button" onClick={() => setPinMode((active) => !active)} className="mt-2 text-xs font-bold text-[#1e3a8a]">{pinMode ? "Done placing pin" : "Enable pin placement"}</button>
              <p className="mt-1 text-xs text-slate-500">{pinMode ? "Double tap the map or drag the red pin to update the exact location." : "Pan and zoom the Google Map normally. Enable pin placement to choose a point."}</p>
              <div className="mt-2 flex flex-wrap gap-2" aria-label="Relevant facilities shown on map">{facilities.map((facility) => <span key={facility} className="rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">{facility}</span>)}</div>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"><span>Latitude <b className="ml-1 text-[#172554]">{coordinates.latitude}° N</b></span><span>Longitude <b className="ml-1 text-[#172554]">{coordinates.longitude}° E</b></span></div>
              <button type="button" onClick={useCurrentLocation} className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#1e3a8a]" disabled={locationStatus === "Finding your location..."}><LocateFixed size={15} /> {locationStatus === "Finding your location..." ? "Finding location..." : "Use current location"}</button>
              {locationStatus && <p className="mt-1 text-xs text-slate-500">{locationStatus}</p>}
              <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="ml-4 inline-flex items-center gap-2 text-xs font-bold text-[#1e3a8a]"><ExternalLink size={14} /> Open in Google Maps</a>
              <button type="button" onClick={saveLocation} className="ml-4 inline-flex items-center gap-2 text-xs font-bold text-[#1e3a8a]"><Bookmark size={14} /> {locationSaved ? "Location saved" : "Save location"}</button>
              <label className="mt-4 block text-xs font-bold text-slate-600">
                Exact address or landmark
                <input
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setMapCenter(`${e.target.value}, India`); updateOfficerForAddress(e.target.value); }}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-indigo-500"
                />
              </label>
            </div>
            <div className="paper rounded-2xl border border-slate-200 bg-white p-5">
              <p className="section-label">Your explanation</p>
              <h2 className="font-bold text-[#172554]">
                Tell the responsible office what happened
              </h2>
              <textarea
                value={details}
                onChange={(e) => { setDetails(e.target.value); setValidationMessage(""); }}
                placeholder={service.prompt}
                className="mt-3 min-h-40 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                Please include the duration, impact and any prior complaint
                reference.
              </p>
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm font-bold text-slate-700">
                <ImagePlus size={18} className="text-[#e26a22]" />
                <span>{photo || "Attach a photo of the problem"}<input type="file" accept="image/*" className="sr-only" onChange={(e) => setPhoto(e.target.files?.[0]?.name || "")} /></span>
              </label>
            </div>
          </div>
          <aside className="paper h-fit rounded-2xl border border-slate-200 bg-white p-5">
            <p className="section-label">Responsible officials</p>
            <h2 className="font-bold text-[#172554]">
              Resolution team for this area
            </h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Choose the officer to receive the first routing recommendation.
            </p>
            <div className="mt-4 space-y-3">
              {service.officers.map((person) => (
                <button
                  key={person[0]}
                  onClick={() => setOfficer(person)}
                  className={`w-full rounded-xl border p-4 text-left ${officer[0] === person[0] ? "border-[#1e3a8a] bg-indigo-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <div className="flex gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-[#172554] text-white">
                      <UserRound size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#172554]">
                        {person[0]}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {person[1]}
                      </p>
                      <p className="mt-1 text-[11px] font-bold text-[#e26a22]">
                        {officer[0] === person[0] ? officer[2] : person[2]}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              <Clock3 className="mr-1 inline" size={14} />
              <b>Service standard:</b> expected resolution tracking begins after
              submission.
            </div>
          </aside>
        </div>
        <button
          disabled={!address.trim()}
          onClick={() => { if (details.trim().length < 12) { setValidationMessage("Please describe the problem in at least 12 characters."); return; } setSubmitted(true); }}
          className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-[#e26a22] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#c65316] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prepare my grievance <Send size={16} />
        </button>
        {validationMessage && <p className="mt-3 text-center text-sm font-bold text-rose-600">{validationMessage}</p>}
      </section>
    </main>
  );
}
