"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Clock,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Cpu,
  AlertCircle,
} from "lucide-react";
import Footer from "@/components/Footer";
import { BackToHomeBtn } from "@/components/backToHomeBtn";
import { getPasswordStrength, capitalize } from "@/lib/helper";

export default function Section1() {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  // Fetch strength using your helper
  const strengthData = getPasswordStrength(password);

  // Dynamic Theme Generator based on Score (0-100)
  const getTheme = (result) => {
    if (!password)
      return {
        color: "bg-gray-200 dark:bg-gray-800",
        text: "text-gray-400",
        border: "border-gray-200 dark:border-gray-800",
      };

    // 0: Very Weak
    if (result === 0)
      return {
        color: "bg-red-500",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-900/50",
      };

    // 25: Weak
    if (result === 1)
      return {
        color: "bg-orange-500",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-900/50",
      };

    // 50: Fair
    if (result === 2)
      return {
        color: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-900/50",
      };

    // 75: Good
    if (result === 3)
      return {
        color: "bg-blue-500",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-900/50",
      };

    // 100: Very Strong (Default fallback for max score)
    return {
      color: "bg-[#009F0F]",
      text: "text-[#008A0D] dark:text-[#1FBF2D]",
      border: "border-[#8EDC94] dark:border-[#004006]/50",
    };
  };

  const theme = getTheme(strengthData.realScore);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex flex-col">
      <main className="grow max-w-4xl mx-auto px-4 sm:px-6 w-full pt-24 pb-24">
       
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <div className="flex flex-col items-center mt-4 gap-4">
            <BackToHomeBtn />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-200/60 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 md:text-lg font-bold mb-6 border border-blue-200 dark:border-blue-800/50">
              <ShieldCheck className="w-5 h-5" /> 100% Client-Side Testing
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-inter mb-4 text-gray-900 dark:text-white tracking-tight">
            Password{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Strength
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-xl mx-auto">
            Find out how resilient your password is against brute-force attacks.
            Everything runs in your browser. We never save what you type.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-4 py-6 md:p-10 border transition-colors duration-500 ${theme.border}`}
        >
          <div className="mb-8 flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 shadow-sm">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium leading-relaxed">
              <span className="font-bold">Safe to test:</span> You can type
              your real passwords! This tool runs{" "}
              <span className="font-bold underline decoration-emerald-400/50 underline-offset-2">
                100% locally
              </span>{" "}
              on your device. Absolutely nothing is sent to our servers.{" "}
              <br className="hidden sm:block" />
              <span className="text-emerald-600/80 dark:text-emerald-400/80 text-xs mt-1 inline-block">
                (Pro tip: You can even turn off your Wi-Fi right now and this
                tool will still work!)
              </span>
            </p>
          </div>
          <div className="relative mb-8">
            <div className="relative rounded-2xl p-0.5 overflow-hidden group bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
             
              <div className="absolute top-1/2 left-1/2 w-[250%] aspect-square -translate-x-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                <div className="w-full h-full animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,#22c55e,#10b981,#14b8a6,#22c55e)] " />
              </div>

              <input
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type a password to test..."
                className="relative z-10 w-full pl-4 pr-12 py-2 bg-gray-50 dark:bg-gray-950 rounded-2xl text-lg md:text-xl font-mono text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="absolute z-10 inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {isVisible ? (
                <EyeOff className="h-6 w-6" />
              ) : (
                <Eye className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Strength Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Strength Score
              </span>
              <span
                className={`text-xs sm:text-sm font-black ${theme.text} transition-colors duration-500`}
              >
                {password ? strengthData.category : "Awaiting Input"}
              </span>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${theme.color} transition-all duration-500 ease-out`}
                style={{ width: `${password ? strengthData.score : 0}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key="strength-meter-main"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className=""
            >
              <motion.div
                layout
                className="font-inter p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 overflow-auto scroll-bar-hide mt-3 max-h-60"
              >

                <motion.div
                  layout
                  key="crack-time-display"
                  className="mt-2 border-t border-gray-100 dark:border-gray-800 space-y-2"
                >
                  <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100 uppercase flex items-center gap-1">
                    <Cpu className="w-4 h-4" /> Estimated Time to Crack
                  </p>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-[12px] md:text-sm font-semibold ${strengthData.score > 70 ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {strengthData?.result
                          ? capitalize(
                              strengthData.result.crack_times_display
                                .offline_slow_hashing_1e4_per_second,
                            )
                          : 0}
                      </span>
                      <span className="text-[12px] text-gray-700 dark:text-gray-200 italic">
                        (standard hacker attack, 10k guesses/sec)
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-[12px] md:text-sm font-semibold text-blue-700 dark:text-blue-400">
                        {strengthData?.result
                          ? capitalize(
                              strengthData.result.crack_times_display
                                .offline_fast_hashing_1e10_per_second,
                            )
                          : 0}
                      </span>
                      <span className="text-[12px] text-gray-700 dark:text-gray-200 italic">
                        (by a supercomputer, 10B guesses/sec)
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
