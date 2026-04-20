"use client";
import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Smartphone, Globe } from "lucide-react";
import { BackToHomeBtn } from "@/components/backToHomeBtn";
import Link from "next/link";

export default function Section5() {
  const features = [
      { icon: <Globe className="w-5 h-5" />, text: "Browser Sync" },
      { icon: <Smartphone className="w-5 h-5" />, text: "Mobile Access" },
    { icon: <Zap className="w-5 h-5" />, text: "Instant Generation" },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      text: "Zero-Knowledge Storage",
    },
  ];

  return (
    <section className="pt-24 pb-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-7 md:p-20 text-center shadow-2xl shadow-blue-500/5"
        >
          <h2 className="text-3xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
            <p>Stop Memorizing.</p>
            <p className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 mt-2">
              Start Securing.
            </p>
          </h2>

          <div className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed space-y-2">
            <p>
              Creating strong passwords{" "}
              <span className="text-[#009F0F] text-nowrap">is easy</span>
              .{" "}
            </p>
            <p className="">
              Remembering dozens of them each unique, complex, and secure{" "}
              <span className="text-rose-500 text-nowrap">is not</span>.
            </p>
          </div><p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"> 
            Let PKey handle the complexity while you enjoy the security.
          </p>
          
          <div className="flex flex-wrap flex-col items-center gap-4 mb-16">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex w-full max-w-70 justify-center items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm text-sm font-bold text-gray-700 dark:text-gray-300"
              >
                <span className="text-emerald-500">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <Link
              href="/sign-up"
              className="px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
            >
              Get Started for Free
            </Link>
          </div>

          <p className="mt-10 text-sm font-bold text-gray-400 uppercase tracking-widest">
            No Credit Card Required • Open Source
          </p>
        </motion.div>
      </div>
    </section>
  );
}
