"use client";
import React from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import {
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  ShieldBan,
} from "lucide-react";
import Logo from "@/components/logo";
import Footer from "@/components/Footer";
import { BackToHomeBtn } from "@/components/backToHomeBtn";

export default function AccountBlockedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <main className="grow flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16">
        <div className="w-full max-w-3xl">
          {/* Main Blocked Card */}
          <ScrollReveal direction="up">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 p-8 md:p-12 text-center shadow-2xl shadow-red-500/5 mb-8">
              {/* Background glow*/}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="flex justify-center mb-10">
                  <Logo />
                </div>

                <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-6 shadow-inner border border-red-100 dark:border-red-800/50">
                  <ShieldBan className="w-10 h-10" />
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-gray-800 dark:text-white mb-4 tracking-tight">
                  Vault{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400">
                    Locked
                  </span>
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
                  Your account has been permanently blocked due to multiple
                  incorrect master password attempts. This is a strict
                  zero-knowledge security measure to protect your data.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Action Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Reset Vault Action */}
            <ScrollReveal direction="up">
              <div className="group p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-orange-100 dark:border-orange-900/30 shadow-sm hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-700/50 transition-all duration-300 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-800/50 group-hover:scale-110 transition-transform">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Reset Vault
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mb-6 grow">
                  Since we don&apos;t know your password, we cannot recover your
                  data. The only way to reuse this account is to reset it
                  completely.
                </p>
                <div className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex gap-2">
                    <span className="text-orange-500 font-black">1.</span>{" "}
                    <Link
                      href="/sign-in"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Log in
                    </Link>{" "}
                    to your account.
                  </div>
                  <div className="flex gap-2">
                    <span className="text-orange-500 font-black">2.</span> Go to
                    Profile &gt; Reset Vault.
                  </div>
                  <div className="flex gap-2">
                    <span className="text-orange-500 font-black">3.</span>{" "}
                    Create a new Master Password.
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> Resetting
                  deletes all saved data.
                </div>
              </div>
            </ScrollReveal>

            {/* Learn More Action */}
            <ScrollReveal direction="up">
              <div className="group p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-300 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/50 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Why did this happen?
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mb-8 grow">
                  Understand PKey&apos;s strict security protocols. We enforce a
                  zero-knowledge architecture, meaning if someone tries to
                  brute-force your vault, we lock it down to prevent
                  unauthorized decryption.
                </p>

                <Link
                  href="/security"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl shadow-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 transition-all duration-300 active:scale-95 group"
                >
                  Read Security Docs{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-all duration-300" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Final Warning Footer */}
          <ScrollReveal direction="up">
            <div className="mt-10 p-5 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-red-500 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                We{" "}
                <span className="text-gray-900 dark:text-white font-black">
                  never store
                </span>{" "}
                your master password. Keep your new one safe.
              </p>
            </div>
          </ScrollReveal>
          <BackToHomeBtn extClassName="hover:scale-105 transition-all duration-300 mt-10" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
