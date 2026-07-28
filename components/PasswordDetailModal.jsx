"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Eye,
  EyeOff,
  Copy,
  CopyCheck,
  ExternalLink,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Pencil,
  Trash2,
  Star,
  Globe,
  KeyRound,
  User,
  Cpu,
  Heart,
} from "lucide-react";
import { capitalize, getPasswordStrength, handleCopy } from "@/lib/helper";
import ScrollReveal from "./ScrollReveal";
import Image from "next/image";

// ── Strength config ───────────────────────────────────────────────────────────
function strengthConfig(strength) {
  if (strength === "strong")
    return {
      label: "Strong",
      icon: <ShieldCheck className="w-4 h-4" />,
      cls: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50",
      bar: "bg-emerald-500",
      barW: "w-full",
    };
  if (strength === "moderate")
    return {
      label: "Moderate",
      icon: <Shield className="w-4 h-4" />,
      cls: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50",
      bar: "bg-amber-500",
      barW: "w-2/3",
    };
  return {
    label: "Weak",
    icon: <ShieldAlert className="w-4 h-4" />,
    cls: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50",
    bar: "bg-red-500",
    barW: "w-1/4",
  };
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyBtn({ value, label }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => handleCopy(value, setCopied)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
        copied
          ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
      }`}
    >
      {copied ? (
        <CopyCheck className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {copied ? "Copied!" : label}
    </button>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function PasswordDetailModal({
  isOpen,
  onClose,
  data,
  onEdit,
  onDelete,
  onToggleFavorite,
  setNewFavState,
}) {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !data) return null;

  const { siteName, usernames = [], password, strength, isFavorite: newFavState, id } = data;
  const strengthCfg = strengthConfig(strength);
  const imgSrc = `https://icons.duckduckgo.com/ip3/${siteName}.ico`;
  const [imgLoaded, setImgLoaded] = useState(true);

  const analysis = getPasswordStrength(password);
  const getValidUrl = (site) =>
    site?.startsWith("http") ? site : `https://${site}`;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center sm:items-center justify-center p-4 bg-gray-950/70 dark:bg-black/80 backdrop-blur-md">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-md md:max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 flex flex-col overflow-hidden animate-scale-in">
        {/* ── Header ── */}
        <div className="relative flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          {/* Gradient top strip */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-2xl md:rounded-3xl" />

          <div className="flex items-center gap-4 min-w-0">
            {/* Site avatar */}
            <div className="relative shrink-0 flex w-12 md:w-16 aspect-square rounded-full overflow-hidden bg-linear-to-r to-blue-600/20 from-purple-600/20 shadow-inner border border-purple-600">
              {imgLoaded && (
                <Image
                  src={imgSrc}
                  alt="Logo"
                  fill
                  className="object-contain scale-80"
                  sizes="100%"
                  onError={() => setImgLoaded(false)}
                />
              )}
              {!imgLoaded && (
                <div className="shrink-0 h-full w-full rounded-full bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 border border-blue-200/50 dark:border-blue-800/30 flex items-center justify-center text-3xl font-black text-blue-600 dark:text-blue-400 uppercase">
                  {siteName?.[0] ?? "?"}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base md:text-lg font-black text-gray-900 dark:text-white truncate">
                  {siteName}
                </h2>
                {/* Strength badge */}
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${strengthCfg.cls}`}
                >
                  {strengthCfg.icon} {strengthCfg.label}
                </span>
              </div>
              {/* Open site link */}
              <a
                href={getValidUrl(siteName)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium mt-0.5"
              >
                {siteName} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onToggleFavorite({
                  idToToggle: id,
                  value: !newFavState,
                  onError: setNewFavState,
                });
                setNewFavState((state) => !state);
              }}
              className={`p-2 rounded-xl transition-all duration-200 ${
                newFavState
                  ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
              aria-label={
                newFavState ? "Remove from favorites" : "Add to favorites"
              }
            >
              <ScrollReveal direction="down">
                <Heart
                  className="w-5 h-5 transition-all duration-300"
                  fill={newFavState ? "red" : "none"}
                  stroke={newFavState ? "red" : "currentColor"}
                />
              </ScrollReveal>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto scroll-bar-hide px-4 md:px-6 py-5 space-y-5">
          {/* ── Usernames ── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-gray-400" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {usernames.length > 1
                  ? `Usernames (${usernames.length})`
                  : "Username"}
              </p>
            </div>
            {usernames.map((username, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {usernames.length > 1 && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate font-mono">
                    {username}
                  </span>
                </div>
                <CopyBtn value={username} label="Copy" />
              </div>
            ))}
          </div>

          {/* ── Password ── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-4 h-4 text-gray-400" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Password
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
              <span
                className={`flex-1 text-sm font-mono font-semibold text-gray-800 dark:text-gray-200 truncate transition-all duration-200 select-${showPassword ? "text" : "none"}`}
              >
                {showPassword ? password : "•".repeat(12)}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <CopyBtn value={password} label="Copy" />
              </div>
            </div>

            {/* Strength bar */}
            <div className="flex items-center gap-3 px-1">
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strengthCfg.bar} ${strengthCfg.barW} rounded-full transition-all duration-500`}
                />
              </div>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                {strengthCfg.label}
              </span>
            </div>
          </div>

          {/* ── Crack time analysis ── */}
          {analysis?.result?.crack_times_display && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-gray-400" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Time to Crack
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Standard attack
                  </p>
                  <p
                    className={`text-sm font-black ${strength === "weak" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}
                  >
                    {capitalize(
                      analysis.result.crack_times_display
                        .offline_slow_hashing_1e4_per_second,
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400 italic mt-0.5">
                    10k guesses/sec
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Supercomputer
                  </p>
                  <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                    {capitalize(
                      analysis.result.crack_times_display
                        .offline_fast_hashing_1e10_per_second,
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400 italic mt-0.5">
                    10B guesses/sec
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Zero-knowledge note ── */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/40">
            <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Decrypted locally using{" "}
              <span className="font-bold text-gray-800 dark:text-gray-200">
                AES-256-GCM
              </span>
              . Nothing was sent to our servers.
            </p>
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div className="shrink-0 flex flex-wrap-reverse text-nowrap items-center gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={() => {
              onDelete?.({ id, siteName: platform, usernames });
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 min-w-1/2 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/50 font-bold text-sm transition-all duration-200 active:scale-95"
          >
            <Trash2 className="w-4 h-4 shrink-0" /> Delete
          </button>
          <button
            onClick={() => {
              onEdit?.({ usernames, password, platform: siteName, id });
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            <Pencil className="w-4 h-4 shrink-0" /> Edit Entry
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
