"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function OfficerLoginPage() {
  const router = useRouter();
  const { loginOfficer } = useAuth();
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await loginOfficer(officerId, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Officer login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-stone-200 bg-[#fbfcf8]/95 px-4 py-3 sm:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#172554] text-white">
              <ShieldCheck size={23} />
            </div>
            <div>
              <div className="font-bold tracking-tight text-[#123d2b]">
                JanSamadhan <span className="text-[#d67828]">Copilot</span>
              </div>
              <div className="text-[10px] text-stone-500">
                Officer control room
              </div>
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-[#172554]"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-16 pt-10 sm:px-6">
        <div className="mb-8 w-full overflow-hidden rounded-3xl bg-[#172554] px-6 py-8 text-center">
          <p className="section-label !text-[#b8c4e8]">RESTRICTED ACCESS</p>
          <h1 className="serif mt-2 text-3xl font-bold text-white sm:text-4xl">
            Officer Login
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-indigo-100">
            Only authorised grievance officers with a valid Officer ID and
            password can access the resolution dashboard.
          </p>
        </div>

        <div className="paper w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="p-6 sm:p-7">
            <div className="mb-5">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[#172554] text-white">
                <BadgeCheck size={26} />
              </div>
              <p className="section-label text-center">AUTHORISED OFFICER</p>
              <h2 className="mt-1 text-center font-bold text-[#172554]">
                Enter your credentials
              </h2>
              <p className="mt-1 text-center text-xs leading-5 text-stone-500">
                Your Officer ID and password are issued privately. Do not share
                them with anyone.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <label className="block text-xs font-bold text-slate-600">
                Officer ID
                <div className="relative mt-1.5">
                  <UserRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                    size={16}
                  />
                  <input
                    required
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    placeholder="e.g. OFF-PRIYA"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm font-medium uppercase outline-none focus:border-indigo-500"
                  />
                </div>
              </label>

              <label className="block text-xs font-bold text-slate-600">
                Password
                <div className="relative mt-1.5">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                    size={16}
                  />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your officer password"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-10 text-sm font-medium outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((show) => !show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#172554] py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-[#0f1c45] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Lock size={16} />
                {submitting ? "Verifying…" : "Log in to Officer Window"}
              </button>
            </form>
          </div>

          <div className="space-y-2 border-t border-stone-100 bg-slate-50 p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Prototype officer credentials (for demo)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white px-3 py-2 font-bold text-stone-600">
                OFF-PRIYA
              </div>
              <div className="rounded-lg bg-white px-3 py-2 font-bold text-stone-600">
                priya@123
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white px-3 py-2 font-bold text-stone-600">
                OFF-AMIT
              </div>
              <div className="rounded-lg bg-white px-3 py-2 font-bold text-stone-600">
                amit@123
              </div>
            </div>
            <p className="pt-1 text-[10px] leading-4 text-stone-400">
              In production these credentials are distributed only to the
              assigned officers.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
