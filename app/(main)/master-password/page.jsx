"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  Zap,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  ServerOff,
  TextCursorInput,
  ArrowRight,
} from "lucide-react";
import Footer from "@/components/Footer";
import { BackToHomeBtn } from "@/components/backToHomeBtn";
import Link from "next/link";

const MasterPasswordGuide = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  };

  const imageHover = {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 px-4 md:px-8">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-10 bg-linear-to-b from-gray-50/40 via-gray-50/60 to-gray-50 dark:from-gray-950/40 dark:via-gray-950/60 dark:to-gray-950 pointer-events-none transition-colors duration-300" />

        <motion.div {...fadeIn} className="relative z-20 opacity-20">
          <div className="flex flex-col items-center mt-4 gap-4">
            <BackToHomeBtn />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-200/60 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 md:text-lg font-bold mb-6 border border-blue-200 dark:border-blue-800/50">
              <ShieldCheck className="w-5 h-5" /> Zero-Knowledge Security
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black font-inter mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight tracking-tighter">
            The Master Password
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
            In PKey, your data belongs only to you. The Master Password is the
            single key that can unlock your encrypted vault.
          </p>
        </motion.div>
      </section>

      <main className="max-w-5xl rounded-2xl mx-auto pt-10 px-6 md:px-10 space-y-28 pb-28 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 mb-20 transition-all duration-300">
        {/* Section 1 */}
        <motion.section
          {...fadeIn}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 tracking-tight">
              <KeyRound className="text-blue-500 w-8 h-8" /> What is it?
            </h2>

            <div className="space-y-5 text-gray-600 dark:text-gray-400 leading-relaxed text-base font-medium">
              <p>
                The Master Password is the <b>"Root Key"</b> of your vault. When
                you use PKey, your data is not protected by a simple password.
              </p>

              <p>
                Your Master Password is used to generate a complex{" "}
                <b>Encryption Key</b> (using PBKDF2). This means even if someone
                hacks our servers, they will only see unreadable encrypted data.
              </p>
            </div>
          </div>

          <motion.div
            {...fadeIn}
            {...imageHover}
            className="bg-white dark:bg-gray-900 p-0 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/30 relative group overflow-hidden"
          >
            <img
              src="\images\A conceptual illustration of a human.webp"
              alt="Master Password Encryption Process Diagram"
              className="w-full h-auto rounded-2xl relative z-10 aspect-video object-cover"
            />

            <div className="absolute -inset-1 bg-linear-to-r from-blue-500/50 to-purple-600/50 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-300" />
          </motion.div>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          {...fadeIn}
          className="bg-emerald-600 rounded-3xl px-4 py-8 md:p-16 text-white overflow-hidden relative shadow-2xl shadow-emerald-500/20"
        >
          <div className="absolute top-0 right-0 p-10 opacity-15 rotate-12">
            <ShieldCheck className="w-80 h-80" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-black mb-6 tracking-tighter">
              Zero-Knowledge Architecture
            </h2>

            <p className="text-blue-100 text-xl mb-10 font-medium">
              Simply put: <b>We do not know your password.</b>
            </p>

            <ul className="space-y-5 text-lg font-semibold">
              {[
                "Your password is never sent to our servers.",
                "Encryption and decryption happen entirely in your browser.",
                "Even PKey employees cannot access your data.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-300 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          {...fadeIn}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <motion.div
            {...imageHover}
            className="order-2 md:order-1 bg-white dark:bg-gray-900 p-0 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/30 overflow-hidden"
          >
            <img
              src="\images\A conceptual 3D render of a glass shield protectin.webp"
              alt="Locked Vault with No Recovery Key Illustration"
              className="w-full h-auto rounded-2xl aspect-square object-cover"
            />
          </motion.div>

          <div className="order-1 md:order-2 space-y-6">
            <div className="flex items-start gap-3">
              <ServerOff className="text-purple-500 w-8 h-8 shrink-0 mt-2" />
              <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
                Why No "Forgot Password"?
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base font-medium">
              Most websites store your password, which allows them to reset it.
              We prioritize privacy. A "Forgot Password" option would mean we
              have access to your key—and we intentionally avoid that so only
              you control your data.
            </p>

            <div className="p-5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex gap-4 items-start">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                  No Recovery Option
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-400/80">
                  If you forget your Master Password, your vault will be
                  permanently locked. Even we cannot recover it. Store it
                  safely, preferably offline.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 4 */}
        <motion.section {...fadeIn} className="text-center space-y-12">
          <h2 className="text-4xl font-black font-inter bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
            Making it Unbreakable
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[
              {
                title: "Length Matters",
                desc: "Use at least 16–20 characters for maximum security and resistance against brute-force attacks.",
                extra: "(eg. G7@kL9!xP2#vQ8zR)",
                icon: <Terminal className="w-5 h-5" />,
                theme: "blue",
                colorClasses:
                  "from-blue-500/20 to-cyan-500/30 dark:from-blue-400/15 dark:to-cyan-400/5 border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400",
                glow: "bg-blue-500/10",
              },
              {
                title: "Mix it Up",
                desc: "Use a combination of uppercase, lowercase, numbers, and symbols to increase complexity.",
                extra: "(eg. P@s5W0rd#X9!)",
                icon: <Zap className="w-5 h-5" />,
                theme: "purple",
                colorClasses:
                  "from-purple-500/20 to-pink-500/30 dark:from-purple-400/20 dark:to-pink-400/10 border-purple-200/50 dark:border-purple-800/50 text-purple-600 dark:text-purple-400",
                glow: "bg-purple-500/10",
              },
              {
                title: "Avoid Patterns",
                desc: "Avoid predictable information like names, birthdays, or common keyboard patterns.",
                extra: "(eg. avoid: 123456, qwerty, john2005)",
                icon: <Lock className="w-5 h-5" />,
                theme: "amber",
                colorClasses:
                  "from-amber-500/20 to-orange-500/30 dark:from-amber-400/15 dark:to-orange-400/5 border-amber-200/50 dark:border-amber-800/50 text-amber-600 dark:text-amber-400",
                glow: "bg-amber-500/10",
              },
              {
                title: "Use Passphrases",
                desc: "Use random words to create a passphrase - stronger, more secure, and easier to remember than traditional passwords.",
                extra: "(eg. BlueTiger!Runs@Midnight)",
                icon: <TextCursorInput className="w-5 h-5" />,
                theme: "emerald",
                colorClasses:
                  "from-emerald-500/20 to-green-500/30 dark:from-emerald-400/15 dark:to-green-400/5 border-emerald-200/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400",
                glow: "bg-emerald-500/10",
              },
            ].map((tip, i) => (
              <div
                key={i}
                className={`relative group p-6 rounded-3xl border transition-all duration-300 overflow-hidden bg-linear-to-br ${tip.colorClasses}`}
              >
                
                <div
                  className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl transition-all duration-300 opacity-40 group-hover:opacity-70 ${tip.glow}`}
                />

                <div className="relative z-10">
                  {/* Icon Wrapper - Minimal and Clean */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-white dark:bg-gray-900 shadow-sm border border-current/10 transition-transform group-hover:-translate-y-1 duration-300`}
                  >
                    {tip.icon}
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-black tracking-tight mb-2 text-gray-900 dark:text-gray-100">
                    {tip.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {tip.desc}
                    {tip.extra && (
                      <span className="font-mono italic bg-transparent text-gray-800 dark:text-gray-300 rounded text-sm text-nowrap">
                        {tip.extra}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

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
              Think your password is safe?
            </h3>
            <p className="text-blue-100 font-medium">
              Hackers can crack most passwords in seconds.
            </p>
            <p className="text-blue-100 font-medium">
              Test the real strength of your passwords and learn how to build an uncrackable digital vault.
            </p>
          </div>
          <Link
            href="/password-strength"
            className="group border z-10 px-4 py-4 bg-white text-blue-600 font-black rounded-full hover:bg-blue-50 transition-all duration-300 shadow-xl active:scale-95 cursor-pointer text-nowrap flex items-center justify-center gap-2"
          >
            Strength Analysis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default MasterPasswordGuide;
