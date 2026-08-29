"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  UserPlus,
  Lock,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, registerUser } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await loginUser(email, password);
      } else {
        await registerUser({ name, email, phone, password });
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

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
                Powered by OpenAI & Codex
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
        <div className="premium-hero mb-8 w-full overflow-hidden rounded-3xl px-6 py-8 text-center">
          <p className="section-label !text-[#ffe0bd]">SECURE CITIZEN ACCESS</p>
          <h1 className="serif mt-2 text-3xl font-bold text-white sm:text-4xl">
            Welcome to JanSamadhan Copilot
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-indigo-100">
            Log in to raise grievances, track your reference numbers, and stay
            in control of every request you file.
          </p>
        </div>

        <div className="paper w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="grid grid-cols-2 border-b border-stone-100">
            <button
              onClick={() => switchMode("login")}
              className={`flex items-center justify-center gap-2 py-3 text-sm font-bold ${mode === "login" ? "border-b-2 border-[#126b48] text-[#123d2b]" : "text-stone-400"}`}
            >
              <LogIn size={16} /> Login
            </button>
            <button
              onClick={() => switchMode("register")}
              className={`flex items-center justify-center gap-2 py-3 text-sm font-bold ${mode === "register" ? "border-b-2 border-[#126b48] text-[#123d2b]" : "text-stone-400"}`}
            >
              <UserPlus size={16} /> Register
            </button>
          </div>

          <div className="p-6 sm:p-7">
            <div className="mb-5">
              <p className="section-label">
                {mode === "login" ? "EXISTING USER" : "NEW USER"}
              </p>
              <h2 className="mt-1 font-bold text-[#172554]">
                {mode === "login"
                  ? "Log in to your account"
                  : "Create your citizen account"}
              </h2>
              <p className="mt-1 text-xs leading-5 text-stone-500">
                {mode === "login"
                  ? "Use the email and password you registered with."
                  : "Register once to file and track grievances anytime."}
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === "register" && (
                <label className="block text-xs font-bold text-slate-600">
                  Full name
                  <div className="relative mt-1.5">
                    <UserRound
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                      size={16}
                    />
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Arun Sharma"
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:border-indigo-500"
                    />
                  </div>
                </label>
              )}

              <label className="block text-xs font-bold text-slate-600">
                Email address
                <div className="relative mt-1.5">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                    size={16}
                  />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:border-indigo-500"
                  />
                </div>
              </label>

              {mode === "register" && (
                <label className="block text-xs font-bold text-slate-600">
                  Phone number (optional)
                  <div className="relative mt-1.5">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                      size={16}
                    />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:border-indigo-500"
                    />
                  </div>
                </label>
              )}

              <label className="block text-xs font-bold text-slate-600">
                Password
                <div className="relative mt-1.5">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                    size={16}
                  />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "register" ? "Minimum 6 characters" : "Your password"}
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
                className="w-full rounded-xl bg-[#126b48] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-[#0f573a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Please wait…"
                  : mode === "login"
                    ? "Log in"
                    : "Create account"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-stone-500">
              {mode === "login" ? (
                <>
                  New to JanSamadhan?{" "}
                  <button
                    onClick={() => switchMode("register")}
                    className="font-bold text-[#126b48]"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    onClick={() => switchMode("login")}
                    className="font-bold text-[#126b48]"
                  >
                    Log in instead
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        <Link
          href="/officer-login"
          className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#1e3a8a]"
        >
          <Lock size={13} /> Officer? Log in with your officer ID
        </Link>
      </section>
    </main>
  );
}
