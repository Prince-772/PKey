"use client";
import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Lock,
  LockOpen,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCcw,
  KeyRound,
  Zap,
  BookOpen,
  ChevronRight,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Scroll,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useMasterPass } from "@/context/MasterPassword";
import MasterPasswordModel from "../masterPassPage";
import CreateMasterPasswordModal from "../CreateMasterPassword";
import { generateAuthData } from "@/lib/masterpassword/mPasscryptoV3";
import { CreateMasterPass } from "@/lib/masterpassword/create";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import BlockedAccount from "../BlockedAccountToast";
import Link from "next/link";
import { useCallback } from "react";

// ── Dummy Data ────────────────────────────────────────────────────────────────
const DUMMY_PASSWORDS = [
  {
    id: 1,
    site: "Google",
    username: "prince@gmail.com",
    password: "MyP@ssw0rd123",
    strength: 62,
  },
  {
    id: 2,
    site: "GitHub",
    username: "prince-772",
    password: "Tr0ub4dor&3",
    strength: 88,
  },
  {
    id: 3,
    site: "Netflix",
    username: "prince@gmail.com",
    password: "pass123",
    strength: 18,
  },
  {
    id: 4,
    site: "Amazon",
    username: "prince@gmail.com",
    password: "pass123",
    strength: 18,
  },
  {
    id: 5,
    site: "Twitter",
    username: "prince_dev",
    password: "qwerty2024",
    strength: 12,
  },
  {
    id: 6,
    site: "LinkedIn",
    username: "prince@gmail.com",
    password: "LinkedIn@123",
    strength: 55,
  },
  {
    id: 7,
    site: "Hotstar",
    username: "prince@gmail.com",
    password: "pass123",
    strength: 18,
  },
  {
    id: 8,
    site: "Figma",
    username: "prince@gmail.com",
    password: "K#9mP!xQ@2vL$n",
    strength: 97,
  },
  {
    id: 9,
    site: "Vercel",
    username: "prince-772",
    password: "Tr0ub4dor&3",
    strength: 88,
  },
  {
    id: 10,
    site: "Notion",
    username: "prince@gmail.com",
    password: "Notion@secure1",
    strength: 72,
  },
];

// ── Analysis helper ───────────────────────────────────────────────────────────
function analyzePasswords(passwords) {
  const weak = passwords.filter((p) => p.strength < 50);
  const medium = passwords.filter((p) => p.strength >= 50 && p.strength < 75);
  const strong = passwords.filter((p) => p.strength >= 75);

  // Find reused — group by password value
  const passMap = {};
  passwords.forEach((p) => {
    if (!passMap[p.password]) passMap[p.password] = [];
    passMap[p.password].push(p);
  });
  const reusedGroups = Object.values(passMap).filter((g) => g.length > 1);
  const reusedIds = new Set(reusedGroups.flat().map((p) => p.id));

  // Health score
  const weakPenalty = weak.length * 8;
  const reusedPenalty = reusedIds.size * 5;
  const base = passwords.length > 0 ? 100 : 0;
  const healthScore = Math.max(
    0,
    Math.min(100, base - weakPenalty - reusedPenalty),
  );

  return { weak, medium, strong, reusedGroups, reusedIds, healthScore };
}

// ── Strength Badge ─────────────────────────────────────────────────────────────
function StrengthBadge({ score }) {
  const cfg =
    score >= 75
      ? {
          label: "Strong",
          cls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
        }
      : score >= 50
        ? {
            label: "Medium",
            cls: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
          }
        : {
            label: "Weak",
            cls: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
          };
  return (
    <span
      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Password Row ───────────────────────────────────────────────────────────────
function PasswordRow({ entry, isReused, delay }) {
  const [visible, setVisible] = useState(false);
  return (
    <ScrollReveal direction="right" delayMs={delay}>
      <div
        className={`group flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all duration-200
      ${
        isReused
          ? "bg-rose-200/50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-800/40 hover:border-rose-400 dark:hover:border-rose-800"
          : "bg-orange-200/50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800/40 hover:border-orange-400 dark:hover:border-orange-800"
      }`}
      >
        {/* Site icon placeholder */}
        <div className="shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-black text-gray-500 dark:text-gray-400 uppercase">
          {entry.site[0]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {entry.site}
            </p>
            <StrengthBadge score={entry.strength} />
            {isReused && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
                Reused
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5 font-mono">
            {visible
              ? entry.password
              : "•".repeat(Math.min(entry.password.length, 14))}
          </p>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-1">
          <button
            onClick={() => setVisible((v) => !v)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            {visible ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
          <Link
            href="/dashboard/vault"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}

// ── Skeleton row ───────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-2 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </div>
      <div className="h-6 w-12 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, icon, count, countCls, children, delay = 0 }) {
  return (
    <ScrollReveal
      direction="up"
      rootMargin="0px 0px -5% 0px"
      delayMs={delay}
      className="space-y-3"
    >
      <div className="flex items-center gap-2" id={`${title.replaceAll(" ","")}`}>
        {icon}
        <h3 className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
          {title}
        </h3>
        {count !== undefined && (
          <span
            className={`text-xs font-black px-2 py-0.5 rounded-full ${countCls}`}
          >
            {count}
          </span>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </ScrollReveal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function SecurityTab() {
  const { encKey, toCreateMasterPass, setToCreateMasterPass } = useMasterPass();
  const { data: session, update } = useSession();

  const [showMasterPassModel, setShowMasterPassModel] = useState(false);
  const [showCreateMasterModel, setShowCreateMasterModel] = useState(false);

  const isUnlocked = Boolean(encKey);

  // Use dummy data for now
  const passwords = DUMMY_PASSWORDS;
  const isEmpty = passwords.length === 0;

  const analysis = useMemo(() => analyzePasswords(passwords), [passwords]);

  const onCreateMasterPass = useCallback(
    async (masterPass) => {
      setToCreateMasterPass(false);
      setShowCreateMasterModel(false);
      const { authHash, salt } = await generateAuthData(masterPass);
      await toast.promise(CreateMasterPass(authHash, salt), {
        loading: "Processing Securely...",
        success: async (res) => {
          if (session)
            await update({ ...session, user: { ...session.user, salt } });
          return res.message || "Master Password created!";
        },
        error: ({ message }) => {
          setToCreateMasterPass(true);
          if (message === "BLOCKED_ACCOUNT") return <BlockedAccount />;
          return message || "Unable to create master password";
        },
      });
    },
    [session, update],
  );

  // Score ring
  const circleRadius = 45;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circumference - (analysis.healthScore / 100) * circumference;
  const scoreColor =
    analysis.healthScore >= 75
      ? "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
      : analysis.healthScore >= 50
        ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
        : "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]";

  const scoreLabel =
    analysis.healthScore >= 75
      ? {
          text: "Vault Secure",
          cls: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        }
      : analysis.healthScore >= 50
        ? {
            text: "Needs Attention",
            cls: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
          }
        : {
            text: "At Risk",
            cls: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
          };
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

  return (
    <div className="w-full mx-auto space-y-6 md:space-y-8 scroll-bar-hide py-3 md:py-5">
      {/* Modals */}
      {showMasterPassModel && (
        <MasterPasswordModel
          isOpen
          onClose={() => setShowMasterPassModel(false)}
        />
      )}
      {showCreateMasterModel && (
        <CreateMasterPasswordModal
          isOpen
          onClose={() => setShowCreateMasterModel(false)}
          onSetMasterPassword={onCreateMasterPass}
        />
      )}

      <div className="space-y-6 md:space-y-8">
        {/* ── Sticky Header ── */}
        <ScrollReveal className="sticky top-0 z-10 w-[104%] -translate-x-[2%] mx-auto pl-4 md:pl-12 border-b border-gray-200/50 dark:border-gray-800/50 py-3 md:py-4 bg-gray-50 dark:bg-gray-950">
          <div>
            <h2 className="text-xl md:text-3xl font-bold font-inter text-gray-900 dark:text-white">
              Security Audit
            </h2>
            <p className="font-roboto text-gray-600 dark:text-gray-400 mt-1 font-medium text-sm">
              {isUnlocked
                ? isEmpty
                  ? "Add some entries to get your security report."
                  : "Your vault analyzed locally. Nothing leaves your device."
                : toCreateMasterPass
                  ? "Set up your vault to get a full security report."
                  : "Unlock your vault to view your security analysis."}
            </p>
            <ScrollReveal className="pt-3" direction="right" delayMs={100}>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black ${vaultStatus.cls}`}
              >
                {vaultStatus.icon}
                {vaultStatus.label}
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>

        {/* ══════════════════════════════════════════════════
              CASE 1 — Vault locked or not created
          ══════════════════════════════════════════════════ */}
        {isUnlocked && (
          <ScrollReveal direction="up" className="space-y-6">
            {/* CTA card */}
            <div
              className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 border shadow-sm
                ${
                  toCreateMasterPass
                    ? "bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 border-transparent text-white"
                    : "bg-white dark:bg-gray-900 border-amber-200 dark:border-amber-800/50"
                }`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20 bg-white" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                <div className="space-y-3 max-w-lg">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center
                      ${
                        toCreateMasterPass
                          ? "bg-white/20 text-white"
                          : "bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800/50 text-amber-600 dark:text-amber-400"
                      }`}
                  >
                    {toCreateMasterPass ? (
                      <ShieldAlert className="w-7 h-7" />
                    ) : (
                      <Lock className="w-7 h-7" />
                    )}
                  </div>
                  <h3
                    className={`text-xl md:text-2xl font-black tracking-tight ${toCreateMasterPass ? "text-white" : "text-gray-900 dark:text-white"}`}
                  >
                    {toCreateMasterPass
                      ? "Set Up Your Vault First"
                      : "Vault is Locked"}
                  </h3>
                  <p
                    className={`text-sm md:text-base font-medium leading-relaxed ${toCreateMasterPass ? "text-blue-100" : "text-gray-600 dark:text-gray-400"}`}
                  >
                    {toCreateMasterPass
                      ? "Your security audit will be available once you create a Master Password and add some entries."
                      : "Enter your Master Password to decrypt and analyze your vault entries."}
                  </p>
                </div>

                <button
                  onClick={() =>
                    toCreateMasterPass
                      ? setShowCreateMasterModel(true)
                      : setShowMasterPassModel(true)
                  }
                  className={`w-full md:w-auto shrink-0 flex items-center justify-center gap-2.5 px-6 py-3 md:py-4 rounded-full font-black text-sm md:text-base shadow-lg active:scale-95 hover:scale-105 transition-all duration-300
                      ${
                        toCreateMasterPass
                          ? "bg-white text-blue-700 hover:bg-blue-50 shadow-white/20"
                          : "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25 hover:shadow-amber-500/40"
                      }`}
                >
                  {toCreateMasterPass ? (
                    <KeyRound className="w-4 h-4 shrink-0" />
                  ) : (
                    <LockOpen className="w-4 h-4 shrink-0" />
                  )}
                  {toCreateMasterPass ? "Set Master Password" : "Unlock Vault"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Skeleton score card */}
            <div className="relative overflow-hidden p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 opacity-40 select-none pointer-events-none">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
                <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <div className="space-y-1 text-center">
                    <div className="h-7 w-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto" />
                    <div className="h-2 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
                  </div>
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                  <div className="h-3 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Skeleton stat grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 select-none pointer-events-none opacity-40">
              {["blue", "red", "rose", "emerald"].map((color) => (
                <div
                  key={color}
                  className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 space-y-3"
                >
                  <div
                    className={`w-9 h-9 rounded-xl bg-${color}-50 dark:bg-${color}-900/30 animate-pulse`}
                  />
                  <div className="h-7 w-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                  <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Skeleton lists */}
            {[3, 2].map((count, si) => (
              <div
                key={si}
                className="space-y-3 opacity-40 select-none pointer-events-none"
              >
                <div className="h-3 w-28 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                {Array.from({ length: count }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ))}
          </ScrollReveal>
        )}

        {/* ══════════════════════════════════════════════════
              CASE 2 — Unlocked but vault is empty
          ══════════════════════════════════════════════════ */}
        {isUnlocked && isEmpty && (
          <ScrollReveal direction="up" className="space-y-6">
            {/* Empty state card */}
            <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-12 bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm text-center">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center gap-5 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">
                    Nothing to Audit Yet
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Your vault is empty. Add your first password entry and come
                    back for a full security analysis.
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

            {/* Static security tips — always useful */}
            <Section
              title="Security Tips"
              icon={<Lightbulb className="w-4 h-4 text-yellow-500" />}
              delay={100}
            >
              {[
                {
                  tip: "Use passphrases — 4 random words are stronger than P@ssw0rd!",
                  icon: <Zap className="w-4 h-4 text-yellow-500" />,
                },
                {
                  tip: "Never reuse passwords across sites — one breach exposes all.",
                  icon: <RefreshCcw className="w-4 h-4 text-blue-500" />,
                },
                {
                  tip: "16+ characters beats complexity every time.",
                  icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
                },
                {
                  tip: "Use our password generator for every new entry.",
                  icon: <Sparkles className="w-4 h-4 text-purple-500" />,
                },
              ].map(({ tip, icon }, i) => (
                <ScrollReveal
                  direction="right"
                  delayMs={100 * i}
                  key={tip}
                  rootMargin="0px 0px -5% 0px"
                >
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                      {icon}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-snug">
                      {tip}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </Section>
          </ScrollReveal>
        )}

        {/* ══════════════════════════════════════════════════
              CASE 3 — Unlocked + has data = full audit
          ══════════════════════════════════════════════════ */}
        {!isUnlocked && !isEmpty && (
          <>
            {/* ── Score card ── */}
            <ScrollReveal
              direction="up"
              className="relative overflow-hidden p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm"
            >
              <div
                className={`absolute top-0 right-0 w-56 h-56 rounded-full blur-[80px] pointer-events-none opacity-10
                  ${analysis.healthScore >= 75 ? "bg-emerald-500" : analysis.healthScore >= 50 ? "bg-amber-500" : "bg-red-500"}`}
              />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-">
                <div>
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
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase ${scoreLabel.cls}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> {scoreLabel.text}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 text-left space-y-3">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                      {analysis.healthScore >= 75
                        ? "Your Vault is Well Protected"
                        : analysis.healthScore >= 50
                          ? "A Few Issues Need Attention"
                          : "Your Vault Needs Immediate Attention"}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium mt-2 max-w-lg">
                      {analysis.weak.length} weak ·{" "}
                      {analysis.reusedGroups.length} reused groups ·{" "}
                      {analysis.strong.length} strong — analyzed locally,
                      nothing sent to server.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* ── Quick stat cards ── */}
            <ScrollReveal
              direction="up"
              delayMs={50}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
            >
              {[
                {
                  label: "Total Entries",
                  value: passwords.length,
                  icon: <KeyRound className="w-5 h-5" />,
                  bg: "bg-blue-50 dark:bg-blue-900/30",
                  text: "text-blue-600 dark:text-blue-400",
                },
                {
                  label: "Weak",
                  value: analysis.weak.length,
                  icon: <AlertTriangle className="w-5 h-5" />,
                  bg: "bg-red-50 dark:bg-red-900/30",
                  text: "text-red-600 dark:text-red-400",
                },
                {
                  label: "Reused",
                  value: analysis.reusedIds.size,
                  icon: <Copy className="w-5 h-5" />,
                  bg: "bg-rose-50 dark:bg-rose-900/30",
                  text: "text-rose-600 dark:text-rose-400",
                },
                {
                  label: "Strong",
                  value: analysis.strong.length,
                  icon: <ShieldCheck className="w-5 h-5" />,
                  bg: "bg-emerald-50 dark:bg-emerald-900/30",
                  text: "text-emerald-600 dark:text-emerald-400",
                },
              ].map(({ label, value, icon, bg, text }, i) => (
                <ScrollReveal key={label} direction="up" delayMs={50 * i}>
                  <div className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:-translate-y-1 transition-all duration-300">
                    <div
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-xl ${bg} ${text} flex items-center justify-center mb-3 md:mb-4`}
                    >
                      {icon}
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-0.5">
                      {value}
                    </p>
                    <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {label}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </ScrollReveal>

            {/* ── Weak passwords ── */}
            {analysis.weak.length > 0 && (
              <Section
                title="Weak Passwords"
                icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
                count={analysis.weak.length}
                countCls="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                delay={80}
              >
                {analysis.weak.map((entry, i) => (
                  <PasswordRow
                    key={entry.id}
                    entry={entry}
                    isReused={analysis.reusedIds.has(entry.id)}
                    delay={50 * i}
                  />
                ))}
              </Section>
            )}

            {/* ── Reused passwords ── */}
            {analysis.reusedGroups.length > 0 && (
              <Section
                title="Reused Passwords"
                icon={<Copy className="w-4 h-4 text-rose-500" />}
                count={analysis.reusedGroups.reduce(
                  (acc, g) => acc + g.length,
                  0,
                )}
                countCls="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                delay={120}
              >
                {analysis.reusedGroups.map((group, gi) => (
                  <div key={gi} className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest px-1">
                      Same password on {group.length} sites
                    </p>
                    {group.map((entry, i) => (
                      <PasswordRow
                        key={entry.id}
                        entry={entry}
                        isReused
                        delay={50 * i}
                      />
                    ))}
                  </div>
                ))}
              </Section>
            )}

            {/* ── What's good ── */}
            <Section
              title="What's Good"
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              delay={160}
            >
              {[
                analysis.strong.length > 0 &&
                  `${analysis.strong.length} passwords are strong and unique`,
                analysis.weak.length === 0 &&
                  "No weak passwords detected — great job!",
                analysis.reusedGroups.length === 0 &&
                  "No reused passwords — every site has a unique key",
                "Zero-Knowledge vault — we never see your data",
                "AES-256-GCM encryption active on all entries",
              ]
                .filter(Boolean)
                .map((item, i) => (
                  <ScrollReveal direction="right" delayMs={50 * i} key={item}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/40">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {item}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
            </Section>

            {/* ── Security tips ── */}
            <Section
              title="Tips to Improve"
              icon={<Lightbulb className="w-4 h-4 text-yellow-500" />}
              delay={200}
            >
              {[
                {
                  tip: "Use passphrases — 4 random words are stronger than P@ssw0rd!",
                  icon: <Zap className="w-4 h-4 text-yellow-500" />,
                },
                {
                  tip: "Never reuse passwords. One breach exposes everything.",
                  icon: <RefreshCcw className="w-4 h-4 text-blue-500" />,
                },
                {
                  tip: "16+ characters beats complexity every time.",
                  icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
                },
              ].map(({ tip, icon }, i) => (
                <ScrollReveal direction="right" key={tip} delayMs={50 * i}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                      {icon}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-snug">
                      {tip}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </Section>

            {/* ── Learn more ── */}
            <ScrollReveal
              direction="right"
              // delayMs={240}
              className="flex flex-wrap gap-3 pb-4"
              rootMargin="0px 0px -5% 0px"
            >
              <ScrollReveal
                rootMargin="0px 0px -5% 0px"
                delayMs={50}
                direction="right"
              >
                <Link
                  href="/security"
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-all duration-200"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Security Architecture
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </ScrollReveal>
              <ScrollReveal
                rootMargin="0px 0px -5% 0px"
                delayMs={200}
                direction="right"
              >
                <Link
                  href="/password-strength"
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 text-xs font-bold transition-all duration-200"
                >
                  <Zap className="w-3.5 h-3.5" /> Password Strength Guide
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </ScrollReveal>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
}
