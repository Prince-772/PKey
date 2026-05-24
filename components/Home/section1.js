"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import { ShieldCheck, ArrowRight, Lock, Key } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const Section1 = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gray-50 dark:bg-gray-950 overflow-hidden py-10 rounded-2xl transition-all duration-300">

      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-full h-full bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-full h-full bg-purple-500/10 dark:bg-purple-600/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <div className="w-full lg:w-3/5 text-center lg:text-left space-y-7">

            {/* Single merged badge */}
            <ScrollReveal direction="up" delayMs={0}>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs md:text-sm font-black tracking-widest uppercase transition-all duration-300">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>Open-Source Password Manager</span>
              </div>
            </ScrollReveal>

            {/* H1 */}
            <ScrollReveal direction="up" delayMs={100}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter text-gray-900 dark:text-white transition-colors duration-300">
                Your Digital Keys, <br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
                  Secured with PKey
                </span>
              </h1>
            </ScrollReveal>

            {/* Paragraph */}
            <ScrollReveal direction="up" delayMs={200}>
              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed transition-colors duration-300">
                Take back control of your security. Generate unbreakable passwords
                and store them in an ultra-secure, client-side encrypted vault.
                <span className="hidden md:inline">
                  {" "}Local encryption. Global access. Total peace of mind.
                </span>
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delayMs={300}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3">
                {[
                  { icon: <Lock className="w-3.5 h-3.5" />, label: "AES-256-GCM" },
                  { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "Zero-Knowledge" },
                  { icon: <Key className="w-3.5 h-3.5" />, label: "WASM Speed" },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
                      bg-gray-100 dark:bg-gray-800/80
                      text-gray-600 dark:text-gray-300
                      border border-gray-200 dark:border-gray-700
                      transition-colors duration-300"
                  >
                    {icon}
                    {label}
                  </span>
                ))}
              </div>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal direction="up" delayMs={400}>
              <div className="font-inter flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/signup"}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white rounded-full bg-linear-to-r from-blue-600 to-purple-600 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 active:scale-95 overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center gap-2">
                    Get Started Securely
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>

                <Link
                  href="/security"
                  className="px-8 py-4 font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  How it works?
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal
            direction="up"
            delayMs={150}
            className="w-full lg:w-2/5 relative flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-[420px] mx-auto">

              <div className="absolute top-0 right-0 z-20 bg-white dark:bg-gray-900 p-3 md:p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 md:gap-4 transition-all duration-300 animate-float">
                <div className="p-2 md:p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 transition-all duration-300">
                  <Lock className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase font-inter">Status</p>
                  <p className="text-xs md:text-sm font-bold font-inter">AES-256-GCM Active</p>
                </div>
              </div>

              <div className="absolute bottom-10 left-0 z-20 bg-white dark:bg-gray-900 p-3 md:p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 md:gap-4 transition-all duration-300 animate-float-down">
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 transition-all duration-300">
                  <Key className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase font-inter">Privacy</p>
                  <p className="text-xs md:text-sm font-bold font-inter">Zero Knowledge</p>
                </div>
              </div>

              {/* Glow backdrop */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-600/20 rounded-[40px] scale-105 blur-lg" />

              {/* Hero image */}
              <div className="relative z-10 w-full h-full rounded-[40px] border flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/hero2.webp"
                  alt="PKey Security Illustration"
                  width={500}
                  height={500}
                  className="object-contain rounded-[40px] drop-shadow-[0_20px_50px_rgba(37,99,235,0.3)] border border-purple-500 shrink-0 select-none"
                  priority
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default Section1;