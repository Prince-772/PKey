"use client";
import React from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Zap,
  Cpu,
  Fingerprint,
  RefreshCcw,
  Database,
  KeyRound,
  ChartNoAxesCombined,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import Steps from "./StepsForSec2";

// ── Part 2: Alternating feature rows ────────────────────────────────────────
const altFeatures = [
  {
    icon: <ChartNoAxesCombined className="h-7 w-7" />,
    color: "cyan",
    title: "Entropy Analysis",
    subtitle: "Real-time strength intelligence",
    desc: "See exactly how long it would take a hacker to crack your password — recalculated with every keystroke. Not just a color bar, but actual time estimates against real attack vectors.",
    visual: "entropy",
  },
  {
    icon: <LockKeyhole className="h-7 w-7" />,
    color: "purple",
    title: "Strong Password Engine",
    subtitle: "One click. Uncrackable.",
    desc: "Our generator doesn't just smash random characters together. It builds high-entropy passwords tuned to site rules — length, symbols, ambiguous chars excluded — so they're strong AND usable.",
    visual: "password",
  },
  {
    icon: <Zap className="h-7 w-7" />,
    color: "yellow",
    title: "WebAssembly Speed",
    subtitle: "Cryptography at native speed",
    desc: "Heavy crypto runs in a background Web Worker via WASM — your UI never freezes, never lags. No server round-trips means your data never leaves the device during processing.",
    visual: "speed",
  },
  {
    icon: <RefreshCcw className="h-7 w-7" />,
    color: "indigo",
    title: "Encrypted Cloud Sync",
    subtitle: "Everywhere. Unreadable to everyone else.",
    desc: "Your vault syncs across all your devices instantly — but what lands on our servers is pure ciphertext. Without your Master Password, it's mathematically useless to anyone who gets it.",
    visual: "sync",
  },
];

const palette = {
  blue: {
    text: "text-blue-600 dark:text-blue-400",
    icon: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    accent: "bg-blue-500",
    step: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  orange: {
    text: "text-orange-600 dark:text-orange-400",
    icon: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    accent: "bg-orange-500",
    step: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-400",
    icon: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    accent: "bg-emerald-500",
    step: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  purple: {
    text: "text-purple-600 dark:text-purple-400",
    icon: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    accent: "bg-purple-500",
    step: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  cyan: {
    text: "text-cyan-600 dark:text-cyan-400",
    icon: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    accent: "bg-cyan-500",
    step: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  },
  yellow: {
    text: "text-yellow-600 dark:text-yellow-400",
    icon: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    accent: "bg-yellow-500",
    step: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  },
  rose: {
    text: "text-rose-600 dark:text-rose-400",
    icon: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    accent: "bg-rose-500",
    step: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
  indigo: {
    text: "text-indigo-600 dark:text-indigo-400",
    icon: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    accent: "bg-indigo-500",
    step: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  },
};

function EntropyVisual() {
  const bars = [
    {
      label: "Online attack",
      time: "3 years",
      w: "w-[55%]",
      color: "bg-amber-400",
    },
    {
      label: "Offline slow hash",
      time: "centuries",
      w: "w-[90%]",
      color: "bg-emerald-400",
    },
    {
      label: "GPU brute-force",
      time: "14 months",
      w: "w-[72%]",
      color: "bg-blue-400",
    },
    {
      label: "Supercomputer",
      time: "48 minutes",
      w: "w-[28%]",
      color: "bg-rose-400",
    },
  ];
  return (
    <ScrollReveal>
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
          Live crack-time estimate
        </p>
        {bars.map((b, i) => (
          <div key={b.label}>
            <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              <span>{b.label}</span>
              <span className="font-black text-gray-900 dark:text-white">
                {b.time}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <ScrollReveal
                direction="right"
                delayMs={i * 100}
                className={`h-full ${b.w} ${b.color} rounded-full transition-all duration-700`}
              />
            </div>
          </div>
        ))}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-xs text-gray-500 font-medium">
            Updates with every keystroke
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

function PasswordVisual() {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
        Generated password
      </p>
      <div className="font-mono text-sm md:text-base font-bold tracking-widest text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4 flex-wrap">
        <span>K#9mP!xQ@2vL$nR7</span>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
          16 chars
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Uppercase", check: true },
          { label: "Lowercase", check: true },
          { label: "Numbers", check: true },
          { label: "Symbols", check: true },
          { label: "No ambiguous chars", check: true },
          { label: "Site-rule aware", check: true },
        ].map(({ label, check }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400"
          >
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            {label}
          </div>
        ))}
      </div>
      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full w-[97%] bg-linear-to-r from-emerald-400 to-emerald-500 rounded-full" />
      </div>
      <p className="text-xs text-gray-500 font-medium">
        Entropy score:{" "}
        <span className="text-emerald-600 dark:text-emerald-400 font-black">
          97 / 100
        </span>
      </p>
    </div>
  );
}

function SpeedVisual() {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
        Performance
      </p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          {
            value: "< 50ms",
            label: "Encryption time",
            color: "text-yellow-600 dark:text-yellow-400",
          },
          {
            value: "0",
            label: "Server round-trips",
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            value: "WASM",
            label: "Runtime engine",
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            value: "BG",
            label: "Worker thread",
            color: "text-purple-600 dark:text-purple-400",
          },
        ].map(({ value, label, color }, i) => (
          <ScrollReveal key={label} direction="right" delayMs={i * 100}>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-[11px] font-semibold text-gray-500 mt-1 leading-tight">
                {label}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <ScrollReveal direction="up">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/50">
        <Zap className="w-4 h-4 text-yellow-500 shrink-0" />
        <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
          UI thread never blocked — zero jank
        </p>
      </div>
      </ScrollReveal>
    </div>
  );
}

function SyncVisual() {
  const devices = ["MacBook", "iPhone", "iPad", "Windows PC"];
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
        Vault sync status
      </p>
      <div className="space-y-3">
        {devices.map((d, i) => (
          <ScrollReveal key={d} direction="right" delayMs={i * 100}>
            <div
            
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {d}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              Synced
            </span>
          </div>
          </ScrollReveal>
        ))}
      </div>
     <ScrollReveal direction="right">
       <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
        <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          Server only sees AES-256 ciphertext
        </p>
      </div>
     </ScrollReveal>
    </div>
  );
}

const visuals = {
  entropy: EntropyVisual,
  password: PasswordVisual,
  speed: SpeedVisual,
  sync: SyncVisual,
};

const Section2 = () => {
  return (
    <section className="bg-linear-to-tl from-blue-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 py-24 relative overflow-hidden rounded-2xl transition-all duration-300">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <ScrollReveal
          direction="up"
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" /> Core Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight transition-colors duration-300">
            Security That{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
              Never Sleeps
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed transition-colors duration-300">
            PKey doesn&apos;t just store passwords, it wraps them in layers of
            modern cryptography, from the moment you type to the moment you
            sync.
          </p>
        </ScrollReveal>

        {/* PART 1 - "How it works" horizontal flow */}
        <Steps />

        {/* PART 2 - Alternating feature rows*/}
        <div className="space-y-24 my-28">
          {altFeatures.map((f, i) => {
            const p = palette[f.color];
            const Visual = visuals[f.visual];
            const isEven = i % 2 === 0;
            return (
              <ScrollReveal key={f.title} direction="up" delayMs={0}>
                <div
                  className={`grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${!isEven ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  {/* Text side */}
                  <div className="space-y-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${p.icon}`}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-black uppercase tracking-widest mb-2 ${p.text}`}
                      >
                        {f.subtitle}
                      </p>
                      <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
                        {f.title}
                      </h3>
                    </div>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed transition-colors duration-300">
                      {f.desc}
                    </p>
                  </div>

                  {/* Visual side */}
                  <div>
                    <Visual />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal
          direction="up"
          className="relative p-8 md:p-12 rounded-[2.5rem] bg-linear-to-br from-blue-600 to-purple-700 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <KeyRound className="w-40 h-40 rotate-12" />
          </div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">
              Want to know more about our security?
            </h3>
            <p className="text-blue-100 font-medium max-w-md">
              Understand exactly how PKey protects your data using
              zero-knowledge encryption and modern cryptography.
            </p>
          </div>
          <Link
            href="/security"
            className="relative z-10 shrink-0 group flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-black rounded-full hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
          >
            Explore Architecture
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Section2;
