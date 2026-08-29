"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const steps = ["Submitted", "Routed", "Under Inspection", "Resolved"];

function TrackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";
  const [ref, setRef] = useState(initialRef);
  const [query, setQuery] = useState(initialRef);
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async (value) => {
    const target = (value || query).trim();
    if (!target) return;
    setLoading(true);
    setError("");
    setQuery(target);
    setRef(target);
    try {
      const res = await fetch(`/api/grievances/${encodeURIComponent(target)}`);
      const data = await res.json();
      if (!res.ok) {
        setGrievance(null);
        setError(data.error || "Could not find this grievance.");
        return;
      }
      setGrievance(data.grievance);
    } catch (err) {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      lookup(initialRef);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRef]);

  const currentStep = (grievance?.steps || []).filter((s) => s.done).length - 1;

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-stone-200 bg-[#fbfcf8]/95 px-4 py-3 sm:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#126b48] text-white">
              <ShieldCheck size={23} />
            </div>
            <div>
              <div className="font-bold tracking-tight text-[#123d2b]">
                JanSamadhan <span className="text-[#d67828]">Copilot</span>
              </div>
              <div className="text-[10px] text-stone-500">
                Grievance tracking
              </div>
            </div>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-[#172554]"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <p className="section-label">TRACK YOUR GRIEVANCE</p>
          <h1 className="serif mt-2 text-3xl font-bold text-[#172554]">
            Check the status by reference number
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-500">
            Enter the reference number you received when you submitted your
            grievance.
          </p>
        </div>

        <div className="paper rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              lookup();
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                size={17}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CPG-2026-01001"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm font-bold uppercase outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-xl bg-[#126b48] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f573a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Searching…" : "Track my grievance"}
            </button>
          </form>

          {error && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              <AlertTriangle size={16} /> {error}
            </p>
          )}

          {grievance && (
            <div className="mt-6">
              <div className="rounded-xl bg-[#164b35] p-5 text-white">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                      Grievance reference
                    </p>
                    <p className="mt-1 break-all text-xl font-bold">
                      {grievance.id}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                    {grievance.status}
                  </span>
                </div>
                <p className="mt-4 text-sm font-bold">{grievance.title}</p>
                <div className="mt-3 grid gap-2 text-xs text-emerald-100 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} /> {grievance.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <UserRound size={14} /> {grievance.officer}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
                <p className="font-bold text-[#172554]">Resolution progress</p>
                <div className="my-6 grid grid-cols-4">
                  {steps.map((step, index) => {
                    const done = index <= currentStep;
                    return (
                      <div className="relative text-center" key={step}>
                        {index < 3 && (
                          <div
                            className={`absolute left-1/2 top-3 h-0.5 w-full ${index < currentStep ? "bg-[#126b48]" : "bg-stone-200"}`}
                          />
                        )}
                        <div
                          className={`relative z-10 mx-auto grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${done ? "bg-[#126b48] text-white" : "bg-stone-200 text-stone-500"}`}
                        >
                          {done ? <Check size={14} /> : index + 1}
                        </div>
                        <p
                          className={`mt-2 text-[10px] font-bold sm:text-xs ${done ? "text-[#174530]" : "text-stone-400"}`}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href={`/raise?ref=${encodeURIComponent(grievance.id)}`}
                  className="rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-bold text-[#1e3a8a]"
                >
                  File a related grievance
                </Link>
                <button
                  onClick={() => router.push("/")}
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#126b48]"
                >
                  Back to services
                </button>
              </div>
            </div>
          )}

          {!grievance && !error && !loading && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-center text-xs text-stone-500">
              <Clock3 className="mx-auto mb-1" size={18} />
              Enter your reference number above to see the live status of your
              grievance.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] p-10 text-center text-sm text-stone-500">Loading tracker…</div>}>
      <TrackInner />
    </Suspense>
  );
}
