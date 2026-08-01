import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  AlertTriangle,
  Copy,
  Clock,
  ChevronRight,
  Activity,
  LockOpen,
  Lock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield,
  BookOpen,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useMasterPass } from "@/context/MasterPassword";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { analyzeVault } from "@/lib/helper";
import { usePasswords } from "@/context/PasswordsProvider";
import { usePasscodes } from "@/context/PasscodesProvider.jsx";

const formatTime = (date) => {
  if (!date) return "—";
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60); // minutes

  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function HomeTab() {
  const circleRadius = 45;
  const circumference = 2 * Math.PI * circleRadius;
  const { passwords, loading: passwordsLoading } = usePasswords();
  const { passcodes, loading: passcodesLoading } = usePasscodes();
  const loading = passwordsLoading || passcodesLoading;
  const {
    encKey,
    toCreateMasterPass,
    decryptedAt,
    setShowMasterPassModel,
    setShowCreateMasterModel,
  } = useMasterPass();
  const { data: session } = useSession();
  const isUnlocked = Boolean(encKey);

  const analysis = useMemo(() => analyzeVault(passwords, passcodes), [passwords, passcodes]);
  const { healthScore } = analysis;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;
  const isEmpty = passwords.length === 0 && passcodes.length === 0;

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!decryptedAt) return;

    const interval = setInterval(() => {
      forceUpdate((n) => n + 1);
    }, 60_000);

    return () => clearInterval(interval); // cleanup
  }, [decryptedAt]);

  const vaultStatus = isUnlocked
    ? {
        label: "Vault Unlocked",
        icon: <LockOpen className="w-3.5 h-3.5" />,
        cls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50",
      }
    : !toCreateMasterPass
      ? {
          label: "Vault Locked",
          icon: <Lock className="w-3.5 h-3.5" />,
          cls: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50",
        }
      : {
          label: "Setup Required",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          cls: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50",
        };

  const vaultSubtext = encKey
    ? "Your vault is decrypted and ready."
    : !toCreateMasterPass
      ? "Enter your Master Password to unlock your vault."
      : "Set up your Master Password to get started.";

  const scoreColor =
    healthScore >= 75
      ? "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
      : healthScore >= 50
        ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
        : "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]";

  const scoreLabel =
    healthScore >= 75
      ? {
          text: "Vault Secure",
          cls: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        }
      : healthScore >= 50
        ? {
            text: "Needs Attention",
            cls: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
          }
        : {
            text: "At Risk",
            cls: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
          };

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="w-full transition-all duration-300 ease-in-out mx-auto space-y-6 md:space-y-8 scroll-bar-hide py-3 md:py-5">
      <div className="space-y-8">
        {/* ── 1. Greeting Header ── */}
        <ScrollReveal className="md:sticky -top-1 z-10 w-[104%] -translate-x-[2%] mx-auto pl-4 md:pl-12 border-b border-gray-200/50 dark:border-gray-800/50 py-2 md:py-4 bg-gray-50 dark:bg-gray-950">
          <h2 className="text-xl md:text-2xl font-bold font-inter text-gray-900 dark:text-white">
            Welcome back, {firstName} 👋
          </h2>
          <p className="font-roboto text-gray-600 dark:text-gray-400 mt-1 font-medium text-sm">
            {vaultSubtext}
          </p>
          <ScrollReveal className="pt-3" direction="right" delayMs={100}>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black ${vaultStatus.cls}`}
            >
              {vaultStatus.icon}
              {vaultStatus.label}
            </div>
          </ScrollReveal>
        </ScrollReveal>

        {/* ══════════════════════════════════════════════════
            CASE 1 — toCreateMasterPass = true (New user)
            No master password set yet
        ══════════════════════════════════════════════════ */}
        {toCreateMasterPass && (
          <div className="space-y-6 pb-1">
            {/* Hero CTA card */}
            <ScrollReveal className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 md:p-12 text-white shadow-2xl shadow-blue-500/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 justify-between flex-wrap">
                <div className="space-y-4 space-x-3">
                  <ScrollReveal
                    delayMs={50}
                    className={`font-inter inline-flex items-center gap-2 px-3 py-2 rounded-full border-[0.5px] text-xs font-semibold bg-blue-900/40 border-green-200 dark:border-green-500/50`}
                  >
                    <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                    <p className="text-white">Zero-Knowledge</p>
                  </ScrollReveal>
                  {/* Badge with glowing sparkles */}
                  <ScrollReveal
                    delayMs={100}
                    className="relative inline-flex items-center gap-2 px-3 py-2 font-inter rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-widest border border-green-500/50"
                  >
                    {/* Main Sparkles icon — glowing */}
                    <span className="relative">
                      <Sparkles className="w-4 h-4 relative z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                      {/* Soft glow blob behind icon */}
                      <span className="absolute inset-0 rounded-full bg-white/30 blur-[6px] animate-pulse" />
                    </span>
                    First Time Setup
                    {/* Tiny orbiting sparkle dots */}
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
                    <span
                      className="absolute -bottom-0.5 left-3 w-1 h-1 rounded-full bg-yellow-300 animate-ping opacity-60"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <span
                      className="absolute top-0 left-8 w-1 h-1 rounded-full bg-blue-200 animate-ping opacity-50"
                      style={{ animationDelay: "0.8s" }}
                    />
                  </ScrollReveal>
                  <h3 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
                    Secure Your Vault with a Master Password
                  </h3>
                  <p className="text-blue-100 font-medium text-sm md:text-base leading-relaxed">
                    Your Master Password is the only key to your vault. It never
                    leaves your device. We use it locally to encrypt everything
                    with{" "}
                    <strong className="text-nowrap font-inter text-white">
                      AES-256-GCM
                    </strong>
                    .
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold font-roboto">
                      We never see your password.
                    </p>
                  </div>
                </div>

                {/* CTA Button — placeholder, parent se function aayega */}
                <ScrollReveal direction="right">
                  <button
                    onClick={() => setShowCreateMasterModel(true)}
                    className="w-full md:w-auto shrink-0 group flex items-center justify-center gap-2.5 px-6 md:px-8 py-3 md:py-4 text-nowrap bg-white text-blue-700 font-black rounded-xl shadow-xl hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-300 text-sm md:text-base"
                  >
                    <KeyRound className="w-5 h-5 shrink-0" />
                    Set Master Password
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </ScrollReveal>
              </div>
            </ScrollReveal>

            {/* What to expect — 3 info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: <Lock className="w-5 h-5" />,
                  color: "blue",
                  title: "Client-Side Only",
                  desc: "Your password encrypts data in your browser. It never touches our servers.",
                },
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  color: "emerald",
                  title: "AES-256-GCM",
                  desc: "Military-grade encryption protects every entry before it syncs to the cloud.",
                },
                {
                  icon: <AlertTriangle className="w-5 h-5" />,
                  color: "amber",
                  title: "No Recovery Option",
                  desc: "If you forget it, your vault is permanently locked. Store it somewhere safe.",
                },
              ].map(({ icon, color, title, desc }, i) => {
                const colors = {
                  blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
                  emerald:
                    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
                  amber:
                    "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
                };
                return (
                  <ScrollReveal
                    delayMs={50 * i}
                    key={title}
                    rootMargin="0px 0px -5% 0px"
                    className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm space-y-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colors[color]}`}
                    >
                      {icon}
                    </div>
                    <h4 className="font-black text-gray-900 dark:text-white text-sm">
                      {title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {desc}
                    </p>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Learn more links */}
            <div className="flex flex-wrap gap-3">
              <ScrollReveal
                direction="right"
                delayMs={50}
                rootMargin="0px 0px -5% 0px"
              >
                <Link
                  href="/security"
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-all duration-200"
                >
                  <Shield className="w-3.5 h-3.5" /> Security Architecture
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </ScrollReveal>
              <ScrollReveal
                direction="right"
                delayMs={100}
                rootMargin="0px 0px -5% 0px"
              >
                <Link
                  href="/master-password"
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 text-xs font-bold transition-all duration-200"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Master Password Guide
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </ScrollReveal>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            CASE 2 — isUnlocked = false, toCreateMasterPass = false
            Master password exists but not entered yet
        ══════════════════════════════════════════════════ */}
        {((!isUnlocked && !toCreateMasterPass) || loading) && (
          <ScrollReveal direction="up" className="space-y-6">
            {/* Unlock CTA card */}
            {!loading && (
              <ScrollReveal
                direction="right"
                className="relative overflow-hidden rounded-[1.5rem] md:rounded-4xl bg-gray-100/50 dark:bg-gray-900 border border-amber-200 dark:border-amber-800/50 p-5 md:p-12 shadow-sm"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
                  <div className="space-y-4 max-w-lg">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Lock className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-3xl font-extrabold font-inter text-gray-900 dark:text-white tracking-tight">
                        Your Vault is Locked
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base leading-relaxed mt-2">
                        Enter your Master Password to decrypt your vault and
                        access your saved entries, security score, and stats.
                      </p>
                    </div>

                    {/* What's behind the lock — blurred preview */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {[
                        "Security Score",
                        "Saved Entries",
                        "Weak Passwords",
                        "Last Sync",
                      ].map((item, i) => (
                        <ScrollReveal delayMs={50 * i} key={item}>
                          <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs font-bold blur-[2px] select-none">
                            {item}
                          </span>
                        </ScrollReveal>
                      ))}
                      <ScrollReveal delayMs={200} direction="right">
                        <span className="px-3 py-1.5 flex gap-1 items-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold">
                          <Lock className="w-3.5 h-3.5 text-yellow-500" />{" "}
                          Unlock to view
                        </span>
                      </ScrollReveal>
                    </div>
                  </div>

                  {/* Unlock button */}
                  <ScrollReveal>
                    <button
                      onClick={() => setShowMasterPassModel(true)}
                      className="w-full md:w-auto shrink-0 group flex items-center justify-center gap-2.5 px-6 md:px-8 py-3 md:py-4 text-nowrap rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white font-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300 text-sm md:text-base"
                    >
                      <LockOpen className="w-5 h-5 shrink-0" />
                      Unlock Vault
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </ScrollReveal>
                </div>
              </ScrollReveal>
            )}

            {/* Blurred score card hint */}
            <ScrollReveal
              rootMargin="0px 0px -5% 0px"
              direction="right"
              className="block relative overflow-hidden rounded-4xl bg-gray-300 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 p-6 md:p-8 opacity-30 select-none pointer-events-none"
            >
              <div className="flex items-center gap-4 md:gap-8 flex-wrap">
                <ScrollReveal
                  direction="right"
                  className="shrink-0 w-24 md:w-32 aspect-square rounded-full border-8 border-gray-400 dark:border-gray-700 flex items-center justify-center"
                >
                  <div className="text-center">
                    <ScrollReveal
                      delayMs={50 * 1}
                      className="h-6 md:h-8 w-9 md:w-12 bg-gray-500/50 dark:bg-gray-600 rounded animate-pulse mx-auto"
                    />
                    <ScrollReveal
                      delayMs={50 * 2}
                      className="h-1 md:h-2 w-7.5 md:w-10 bg-gray-500/50 dark:bg-gray-600 rounded animate-pulse mt-1 mx-auto"
                    />
                  </div>
                </ScrollReveal>

                <div className="space-y-2 shrink-0 w-[min(100%,300px)]">
                  <ScrollReveal
                    direction="right"
                    delayMs={50 * 1}
                    className="h-3 w-[min(37.5%,96px)] bg-gray-400/50 dark:bg-gray-700 rounded animate-pulse"
                  />
                  <ScrollReveal
                    direction="right"
                    delayMs={50 * 2}
                    className="h-6 w-[min(75%,192px)] bg-gray-500/50 dark:bg-gray-600 rounded animate-pulse"
                  />
                  <ScrollReveal
                    direction="right"
                    delayMs={50 * 3}
                    className="h-3 w-[min(100%,256px)] bg-gray-400/50 dark:bg-gray-700 rounded animate-pulse"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Skeleton stats — blurred hint of what's underneath */}
            <ScrollReveal
              rootMargin="0px 0px -5% 0px"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 select-none pointer-events-none"
            >
              {[
                { color: "blue", label: "Saved Entries" },
                { color: "orange", label: "Weak Passwords" },
                { color: "rose", label: "Reused Passwords" },
                { color: "purple", label: "Last Decrypted" },
              ].map(({ color, label }, i) => {
                const iconBg = {
                  blue: "bg-blue-100 dark:bg-blue-900/30",
                  orange: "bg-orange-100 dark:bg-orange-900/30",
                  rose: "bg-rose-100 dark:bg-rose-900/30",
                  purple: "bg-purple-100 dark:bg-purple-900/30",
                };
                return (
                  <ScrollReveal
                    rootMargin="0px 0px -5% 0px"
                    delayMs={50 * i}
                    key={label}
                    className="p-5 rounded-2xl bg-gray-300 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm opacity-40"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${iconBg[color]} mb-4`}
                    />
                    <div className="h-8 w-16 bg-gray-400 dark:bg-gray-700 rounded-lg mb-2 animate-pulse" />
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest">
                      {label}
                    </p>
                  </ScrollReveal>
                );
              })}
            </ScrollReveal>
          </ScrollReveal>
        )}

        {/* ══════════════════════════════════════════════════
            CASE 3a — isUnlocked = true, isEmpty = true
            Vault unlocked but no passwords yet
        ══════════════════════════════════════════════════ */}
        {isUnlocked && isEmpty && (
          <ScrollReveal direction="up" className="space-y-6">
            {/* Empty state card */}
            <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-12 bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm text-center">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center gap-5 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <KeyRound className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">
                    Your Vault is Ready
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Your vault is unlocked and secure, but there&apos;s nothing
                    in it yet. Add your first password entry to get started.
                  </p>
                </div>
                <Link
                  href="/dashboard/add"
                  className="group flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-black text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <KeyRound className="w-4 h-4 shrink-0" />
                  Add First Entry
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Quick-start tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: <KeyRound className="w-5 h-5" />,
                  color: "blue",
                  title: "Add Passwords",
                  desc: "Save your logins securely with AES-256-GCM encryption. Each entry is encrypted before it ever leaves your device.",
                },
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  color: "emerald",
                  title: "Use Strong Passwords",
                  desc: "Our built-in password generator creates unique, strong passwords for every site you add.",
                },
                {
                  icon: <Activity className="w-5 h-5" />,
                  color: "purple",
                  title: "Monitor Security",
                  desc: "Once you add entries, visit the Security tab to get a full audit of weak, reused, and compromised passwords.",
                },
              ].map(({ icon, color, title, desc }, i) => {
                const colors = {
                  blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
                  emerald:
                    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
                  purple:
                    "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/50",
                };
                return (
                  <ScrollReveal
                    delayMs={50 * i}
                    key={title}
                    rootMargin="0px 0px -5% 0px"
                    className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm space-y-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colors[color]}`}
                    >
                      {icon}
                    </div>
                    <h4 className="font-black text-gray-900 dark:text-white text-sm">
                      {title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {desc}
                    </p>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Vault info link */}
            <ScrollReveal
              direction="right"
              delayMs={150}
              rootMargin="0px 0px -5% 0px"
            >
              <Link
                href="/dashboard/vault"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-all duration-200"
              >
                <LockOpen className="w-3.5 h-3.5" /> Go to Vault
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </ScrollReveal>
          </ScrollReveal>
        )}

        {/* ══════════════════════════════════════════════════
            CASE 3b — isUnlocked = true, !isEmpty
            Full dashboard with data
        ══════════════════════════════════════════════════ */}
        {isUnlocked && !isEmpty && (
          <>
            {/* 2. Security Score Card */}
            <ScrollReveal className="relative overflow-hidden p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all duration-300">
              <div
                className={`absolute top-0 right-0 w-56 h-56 rounded-full blur-[80px] pointer-events-none opacity-10
                  ${analysis.healthScore >= 75 ? "bg-emerald-500" : analysis.healthScore >= 50 ? "bg-amber-500" : "bg-red-500"}`}
              />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-">
                <div className="flex flex-col items-center">
                  {/* Ring */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg
                      viewBox="0 0 128 128"
                      className="w-24 h-24 md:w-32 md:h-32 -rotate-90 overflow-visible"
                    >
                      <circle
                        cx="64"
                        cy="64"
                        r={circleRadius}
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-gray-100 dark:text-gray-800"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r={circleRadius}
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`${scoreColor} transition-all duration-1000 ease-out`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-none">
                        {analysis.healthScore}
                      </span>
                      <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        Score
                      </span>
                    </div>
                  </div>
                  <div
                    className={`inline-flex border items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase ${scoreLabel.cls}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> {scoreLabel.text}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 text-left space-y-3 font-inter">
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      {analysis.healthScore >= 75
                        ? "Your Vault is Well Protected"
                        : analysis.healthScore >= 50
                          ? "A Few Issues Need Attention"
                          : "Your Vault Needs Immediate Attention"}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium mt-2 max-w-lg">
                      {analysis.weak?.length || 0} weak ·{" "}
                      {analysis.reusedGroups?.length || 0} reused groups ·{" "}
                      {analysis.passwords.strong.length + analysis.passcodes.strong.length} strong. Analyzed locally, nothing
                      sent to server.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard/security"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-2 md:mt-4 ml-2 md:ml-4"
              >
                Improve Score <ChevronRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>

            {/* 3. Quick Stats Grid */}
            <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <ScrollReveal delayMs={100 * 1}>
                <div className="p-4 md:p-5 h-full rounded-xl md:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 md:mb-4">
                    <KeyRound className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <p className="text-lg md:text-3xl font-black text-gray-900 dark:text-white mb-1">
                    {passwords.length + passcodes.length}
                  </p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Saved Entries
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delayMs={100 * 2}>
                <div className="p-4 md:p-5 h-full rounded-xl md:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2 md:mb-4">
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <p className="text-lg md:text-3xl font-black text-gray-900 dark:text-white mb-1">
                    {analysis.weak.length}
                  </p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Weak Passwords
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delayMs={100 * 3}>
                <div className="p-4 md:p-5 h-full rounded-xl md:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 md:mb-4">
                    <Copy className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <p className="text-lg md:text-3xl font-black text-gray-900 dark:text-white mb-1">
                    {analysis.reusedGroups.reduce(
                      (acc, g) => acc + g.length,
                      0,
                    )}
                  </p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Reused Passwords
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delayMs={100 * 4}>
                <div className="p-4 md:p-5 h-full rounded-xl md:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 md:mb-4">
                    <Clock className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <p className="text-base md:text-lg font-black text-gray-900 dark:text-white mb-1 leading-tight">
                    {formatTime(decryptedAt)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Last Decrypted
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
}
