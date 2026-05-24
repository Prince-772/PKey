"use client";
import ScrollReveal from "@/components/ScrollReveal";
import React from "react";

import {
  Ruler,
  TextCursorInput,
  Fingerprint,
  ShieldCheck,
  Smartphone,
  Shuffle,
} from "lucide-react";

export default function Section2() {
  const educationCards = [
    {
      id: "length",
      icon: <Ruler className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Length Beats Complexity",
      desc: "A 16-character password with just lowercase letters takes longer to crack than an 8-character password packed with symbols. Always prioritize length.",
      cardTheme:
        "hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
      iconBg:
        "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/50",
      glow: "bg-blue-500/10",
    },
    {
      id: "passphrase",
      icon: (
        <TextCursorInput className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      ),
      title: "The Power of Passphrases",
      desc: "Instead of 'P@ssw0rd1!', use a phrase like 'BlueTigerRunsAtMidnight'. It's mathematically stronger against brute-force and much easier for you to remember.",
      cardTheme:
        "hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/10",
      iconBg:
        "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800/50",
      glow: "bg-purple-500/10",
    },
    {
      id: "uniqueness",
      icon: (
        <Fingerprint className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Never Recycle",
      desc: "If you use the same strong password everywhere, a single website breach compromises your entire digital identity. Every vault item needs a unique key.",
      cardTheme:
        "hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10",
      iconBg:
        "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800/50",
      glow: "bg-emerald-500/10",
    },
    {
      id: "entropy",
      icon: (
        <Shuffle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
      ),
      title: "Unpredictability Wins",
      desc: "Avoid patterns, names, or keyboard sequences like 'qwerty' or '1234'. Attackers use smart dictionaries and pattern recognition. True strength comes from randomness, not just length or symbols.",
      cardTheme:
        "hover:border-orange-200 dark:hover:border-orange-800 hover:bg-orange-50/50 dark:hover:bg-orange-900/10",
      iconBg:
        "bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800/50",
      glow: "bg-orange-500/10",
    },
  ];

  return (
    <section className="py-8 md:py-12 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Beyond the Score
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            A strong password isn't just about random symbols. Master these
            three golden rules of digital security.
          </p>
        </ScrollReveal>

        {/* The Grid */}
        <ScrollReveal direction="up" className="grid md:grid-cols-2 gap-8">
          {educationCards.map((card) => (
            <ScrollReveal key={card.id} direction="up">
              <div
                className={`relative h-full group p-8 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${card.cardTheme}`}
              >
                <div
                  className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-60 ${card.glow}`}
                />

                <div className="relative z-10">
                  {/* Tinted Icon Wrapper */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border group-hover:scale-110 transition-transform duration-300 ${card.iconBg}`}
                  >
                    {card.icon}
                  </div>

                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 group-hover:text-current transition-colors duration-300">
                    {card.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
