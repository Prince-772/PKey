"use client";
import React from "react";
import Link from "next/link";
import {
  Quote,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  BadgeCheck,
} from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const testimonials = [
  {
    quote:
      "PKey has completely changed how I handle passwords. I don't have to remember anything anymore, and everything just works seamlessly.",
    author: "Arpit Kushwaha",
    title: "Marketing Manager",
    tag: "Productivity",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arpit&mouth=smile&top=shortFlat&clothing=overall&clothingColor=3c4f5e",
  },
  {
    quote:
      "The auto-fill and cross-device sync are insanely smooth. I can log in anywhere in seconds without worrying about security.",
    author: "Sreyash Pandey",
    title: "Software Engineer",
    tag: "Sync",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sreyash&mouth=default&top=shortWaved&accessories=round&clothing=hoodie",
  },
  {
    quote:
      "Strong encryption and zero stress. I finally feel confident that my credentials are safe and completely unexposed to anyone.",
    author: "Kishan Yadav",
    title: "Senior Security Engineer",
    tag: "Security",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kishan&mouth=smile&top=shortRound&accessories=prescription02",
  },
  {
    quote:
      "The password strength meter is a game changer. No more weak passwords, everything is analyzed and handled perfectly.",
    author: "Ayush Kumar",
    title: "Freelance Web Developer",
    tag: "Strength Meter",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit&mouth=smile&top=shortFlat&accessories=prescription02&facialHair=beardLight&clothing=hoodie&clothingColor=262626",
  },
  {
    quote:
      "Finally a password manager that doesn't make me feel paranoid about the tool itself. Open source and zero-knowledge is exactly what I needed.",
    author: "Aarohi Maurya",
    title: "Cybersecurity Analyst",
    tag: "Zero-Knowledge",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarohi&mouth=smile&top=longButNotTooLong&topColor=4a3728&skinColor=f8d25c&clothing=blazerAndShirt&clothingColor=3c4f5e",
  },
  {
    quote:
      "Setup took under 2 minutes. The vault UI is clean and intuitive. I migrated from another manager and never looked back.",
    author: "Rahul Verma",
    title: "Product Designer",
    tag: "Easy Setup",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&mouth=smile&top=shortFlat&clothing=graphicShirt&clothingColor=5199e4",
  },
];

const tagColors = {
  Productivity:
    "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  Sync: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  Security:
    "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  "Strength Meter":
    "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
  "Zero-Knowledge":
    "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
  "Easy Setup":
    "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300",
};

export default function Section3() {
  return (
    <section className="py-24 bg-linear-to-br from-blue-200 to-purple-200 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 overflow-hidden rounded-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ScrollReveal direction="up" className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/70 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs font-black tracking-widest uppercase mb-6">
            <BadgeCheck className="w-4 h-4" /> Verified Users
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
            Trusted by{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
              Digital Nomads
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium transition-colors duration-300">
            Join thousands of users who have upgraded their digital security
            with PKey&apos;s Zero-Knowledge Vault.
          </p>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          delayMs={100}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mb-20 py-6 border-y border-blue-200/50 dark:border-blue-800/30"
        >
          {[
            { value: "10K+", label: "Active Vaults" },
            { value: "AES-256", label: "Encryption Standard" },
            { value: "100%", label: "Client-Side" },
            { value: "0", label: "Data Breaches" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                {value}
              </p>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
                {label}
              </p>
            </div>
          ))}
        </ScrollReveal>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 mb-20 gap-x-6">
          {testimonials.map((t, i) => (
            <ScrollReveal
              key={i}
              direction="up"
              delayMs={i * 60}
              className="break-inside-avoid mb-6"
            >
              <div className="relative group p-7 rounded-[28px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5">
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-[28px] bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />

                {/* Stars + tag */}
                <div className="flex justify-between items-center mb-5 relative z-10">
                  <div className="flex gap-0.5 pl-2.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${tagColors[t.tag]}`}
                  >
                    {t.tag}
                  </span>
                </div>

                {/* Quote text */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium leading-relaxed text-sm md:text-base italic relative z-10 transition-colors duration-300">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-gray-100 dark:border-gray-800 relative z-10">
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src={t.img}
                      alt={t.author}
                      fill
                      sizes="40px"
                      className="object-cover rounded-full bg-blue-100 dark:bg-blue-900/30 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-gray-900 dark:text-white text-sm leading-none transition-colors duration-300">
                        {t.author}
                      </h4>
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                      {t.title}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal
          direction="up"
          className="relative rounded-[32px] bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 md:p-16 text-center text-white shadow-2xl shadow-blue-500/20 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400/20 blur-[100px] translate-x-1/2 translate-y-1/2 rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Ready to Secure Your <br className="hidden sm:block" /> Digital
              Life?
            </h2>
            <p className="text-xl text-blue-100 font-medium">
              Join PKey today. It takes less than 2 minutes to set up your
              zero-knowledge vault.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/signup"
                className="group p-4 sm:px-10 sm:py-5 bg-white text-blue-700 font-black rounded-full text-sm sm:text-lg shadow-xl hover:bg-blue-50 hover:scale-105 active:scale-95 duration-300 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Create Free Vault
                <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10 pt-6 opacity-70">
              {[
                {
                  icon: <ShieldCheck className="w-4 h-4" />,
                  label: "AES-256-GCM Standard",
                },
                {
                  icon: <Cpu className="w-4 h-4" />,
                  label: "Argon2id Protected",
                },
                {
                  icon: <Zap className="w-4 h-4" />,
                  label: "Instant Cross-Device Sync",
                },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm font-bold"
                >
                  {icon} {label}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}