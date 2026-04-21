"use client";
import React from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: "Zero-Knowledge Security",
    desc: "Your master password never reaches our servers. Encryption and decryption happen strictly on your device.",
    color: "blue",
    size: "large",
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Argon2id Memory-Hardness",
    desc: "State-of-the-art memory-hard hashing that consumes device RAM to neutralize advanced GPU brute-force attacks.",
    color: "orange",
    size: "small",
  },
  {
    icon: <Database className="h-7 w-7" />,
    title: "AES-256-GCM Encryption",
    desc: "Military-grade authenticated encryption. GCM ensures your data is mathematically tamper-proof.",
    color: "emerald",
    size: "small",
  },
  {
    icon: <LockKeyhole className="h-6 w-6" />,
    title: "Suggest Strong Password Engine",
    desc: "Generate unique, complex, and unguessable passwords with a single click, tailored to your specific needs.",
    color: "purple",
    size: "large",
  },
  {
    icon: <ChartNoAxesCombined className="w-6 h-6" />,
    title: "Entropy Analysis",
    desc: "See how strong your password is in real time - and exactly how long it would take a hacker to crack it.",
    color: "cyan",
    size: "large",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "WebAssembly (WASM) Speed",
    desc: "Lightning-fast cryptography runs on background Web Workers, ensuring zero UI lag or server delays.",
    color: "yellow",
    size: "small",
  },
  {
    icon: <Fingerprint className="h-6 w-6" />,
    title: "HKDF Key Isolation",
    desc: "Your master key is cryptographically split into strict authentication and encryption keys for maximum architecture security.",
    color: "rose",
    size: "small",
  },
  {
    icon: <RefreshCcw className="h-6 w-6" />,
    title: "Encrypted Cloud Sync",
    desc: "Your data is accessible worldwide, but completely unreadable to anyone without your local Master Password.",
    color: "indigo",
    size: "small",
  },
];

const colorConfig = {
  blue: {
    bg: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    border: "border-blue-500",
    hoverText: "group-hover:text-blue-500",
    shadow: "shadow-blue-500/20",
  },
  orange: {
    bg: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    border: "border-orange-500",
    hoverText: "group-hover:text-orange-500",
    shadow: "shadow-orange-500/20",
  },
  purple: {
    bg: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    border: "border-purple-500",
    hoverText: "group-hover:text-purple-500",
    shadow: "shadow-purple-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    border: "border-emerald-500",
    hoverText: "group-hover:text-emerald-500",
    shadow: "shadow-emerald-500/20",
  },
  rose: {
    bg: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    border: "border-rose-500",
    hoverText: "group-hover:text-rose-500",
    shadow: "shadow-rose-500/20",
  },
  yellow: {
    bg: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    border: "border-yellow-500",
    hoverText: "group-hover:text-yellow-500",
    shadow: "shadow-yellow-500/20",
  },
  cyan: {
    bg: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    border: "border-cyan-500",
    hoverText: "group-hover:text-cyan-500",
    shadow: "shadow-cyan-500/20",
  },
  indigo: {
    bg: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    border: "border-indigo-500",
    hoverText: "group-hover:text-indigo-500",
    shadow: "shadow-indigo-500/20",
  },
};

const Section2 = () => {
  return (
    <section className="bg-linear-to-tl from-blue-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 py-24 relative overflow-hidden rounded-2xl transition-all duration-300">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0.5, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest transition-colors duration-300"
          >
            Core Capabilities
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight transition-colors duration-300">
            Security That <span className="text-blue-600">Never Sleeps</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed transition-colors duration-300">
            PKey doesn&apos;t just store passwords - it protects them using
            layers of modern cryptography.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 auto-rows-[1fr]">
          {features.map((f, i) => {
            const colorData = colorConfig[f.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`group p-6 rounded-2xl md:rounded-4xl border bg-linear-to-br from-blue-200 to-blue-100 dark:from-blue-950 dark:to-slate-900 transition-all duration-300 hover:-translate-y-1 ${
                  f.size === "large" ? "md:col-span-2" : "md:col-span-1"
                } ${colorData.border} ${colorData.shadow} overflow-hidden shadow-md hover:shadow-xl`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border ${colorData.bg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  {f.icon}
                </div>

                <h3
                  className={`text-xl font-black text-gray-900 dark:text-white mb-3 tracking-tight ${colorData.hoverText} transition-colors duration-300`}
                >
                  {f.title}
                </h3>

                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium transition-colors duration-300">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Deep Dive Tip Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-[40px] bg-linear-to-br from-blue-600 to-purple-700 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <KeyRound className="w-40 h-40 rotate-12" />
          </div>
          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl font-black">
              Want to know more about our security?
            </h3>
            <p className="text-blue-100 font-medium">
              Understanding how PKey protects your data using encryption and
              zero-knowledge design.
            </p>
          </div>
          <Link
            href="/security"
            className="border z-10 px-8 py-4 bg-white text-blue-600 font-black rounded-full hover:bg-blue-50 transition-all duration-300 shadow-xl active:scale-95 cursor-pointer"
          >
            Explore Architecture
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Section2;
