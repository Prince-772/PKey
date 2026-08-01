"use client";

import { capitalize, getPasswordStrength, handleCopy } from "@/lib/helper";
import {
  Copy,
  CopyCheck,
  Cpu,
  Eye,
  EyeOff,
  ExternalLink,
  Heart,
  KeyRound,
  Pencil,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedUsername, setCopiedUsername] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const {
    siteName,
    usernames = [],
    password,
    strength,
    isFavorite: newFavState,
    id,
  } = data;
  const strengthCfg = strengthConfig(strength);
  const imgSrc = `https://icons.duckduckgo.com/ip3/${siteName}.ico`;
  const analysis = getPasswordStrength(password);
  const getValidUrl = (site) => site?.startsWith("http") ? site : `https://${site}`;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 p-4 backdrop-blur-md">
      <button className="absolute inset-0" onClick={onClose} aria-label="Close modal" />

      <div className="relative z-10 w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl border border-blue-200 bg-white shadow-2xl dark:border-blue-900 dark:bg-gray-900 animate-scale-in scroll-bar-hide">
        <div className="h-1.5 shrink-0 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600" />

        <div className="flex items-center gap-3 border-b border-gray-100 p-5 dark:border-gray-800">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            {imgLoaded && (
              <Image src={imgSrc} alt="Logo" fill sizes="100%" className="scale-80 object-contain" onError={() => setImgLoaded(false)} />
            )}
            {!imgLoaded && <span className="text-lg font-black uppercase text-white">{siteName?.[0] ?? "?"}</span>}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Password details</p>
            <div className="flex items-center gap-2">
              <h2 className="truncate text-xl font-black text-gray-900 dark:text-white">{siteName}</h2>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${strengthCfg.cls}`}>
                {strengthCfg.icon} {strengthCfg.label}
              </span>
            </div>
            <a href={getValidUrl(siteName)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400">
              Open site <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => {
                onToggleFavorite?.({ idToToggle: id, value: !newFavState, onError: setNewFavState });
                setNewFavState?.((s) => !s);
              }}
              className={`cursor-pointer rounded-full p-2 transition-all duration-200 ${
                newFavState ? "bg-red-50 text-red-500 dark:bg-red-900/20" : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:bg-gray-800 dark:hover:bg-red-900/20"
              }`}
              aria-label={newFavState ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className="h-5 w-5 transition-all duration-300" fill={newFavState ? "currentColor" : "none"} />
            </button>
            <button onClick={onClose} className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {/* ── PIN/Password card ── */}
          <div className="rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Password</p>
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate font-mono text-base font-bold text-blue-800 dark:text-blue-200">
                {showPassword ? password : "••••••••••••"}
              </span>
              <button onClick={() => setShowPassword((v) => !v)} className="cursor-pointer rounded-xl bg-white p-2 text-blue-700 shadow-sm dark:bg-gray-800 dark:text-blue-300" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={() => handleCopy(password, setCopiedPassword)} className="cursor-pointer rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-700" aria-label="Copy password">
                {copiedPassword ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/70 dark:bg-gray-800/70">
                <div className={`h-full ${strengthCfg.bar} ${strengthCfg.barW} rounded-full transition-all duration-500`} />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">
                <KeyRound className="h-3 w-3" /> {strengthCfg.label}
              </span>
            </div>
          </div>

          {/* ── Crack time - vertical stack ── */}
          {analysis?.result?.crack_times_display && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Time to Crack</h3>
              </div>
              <div className="space-y-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Standard attack</p>
                  <p className={`text-sm font-black ${strength === "weak" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {capitalize(analysis.result.crack_times_display.offline_slow_hashing_1e4_per_second)}
                  </p>
                  <p className="mt-0.5 text-[10px] italic text-gray-400">10k guesses/sec</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Supercomputer</p>
                  <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                    {capitalize(analysis.result.crack_times_display.offline_fast_hashing_1e10_per_second)}
                  </p>
                  <p className="mt-0.5 text-[10px] italic text-gray-400">10B guesses/sec</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Usernames ── */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-black text-gray-900 dark:text-white">
                {usernames.length > 1 ? `Usernames / IDs (${usernames.length})` : "Username"}
              </h3>
            </div>
            <div className="space-y-2">
              {usernames.map((username, index) => (
                <div key={`${username}-${index}`} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800/70">
                  {usernames.length > 1 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                      {index + 1}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate font-mono text-sm text-gray-700 dark:text-gray-200">{username}</span>
                  <button onClick={() => handleCopy(username, (copied) => setCopiedUsername(copied ? index : null))} className="cursor-pointer text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" aria-label={`Copy username ${index + 1}`}>
                    {copiedUsername === index ? <CopyCheck className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Zero-knowledge note ── */}
          <div className="flex items-center gap-3 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 p-3.5 border border-blue-100 dark:border-blue-900/40 dark:from-blue-950/30 dark:to-indigo-950/30">
            <ShieldCheck className="h-4 w-4 shrink-0 text-blue-500" />
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Decrypted locally using <span className="font-bold text-gray-800 dark:text-gray-200">AES-256-GCM</span>. Nothing was sent to our servers.
            </p>
          </div>
        </div>

        {/* ── Footer actions - modern gradient style ── */}
        <div className="flex shrink-0 flex-wrap-reverse items-center gap-3 border-t border-gray-100 p-5 dark:border-gray-800">
          <button
            onClick={() => { onDelete?.({ id, siteName, usernames }); onClose(); }}
            className="flex min-w-1/2 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition-all duration-200 hover:bg-red-50 active:scale-95 dark:border-red-800/50 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4 shrink-0" /> Delete
          </button>
          <button
            onClick={() => { onEdit?.({ usernames, password, platform: siteName, id }); onClose(); }}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/30 active:scale-95"
          >
            <Pencil className="h-4 w-4 shrink-0" /> Edit Entry
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}