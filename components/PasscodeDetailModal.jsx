"use client";

import { handleCopy } from "@/lib/helper";
import {
  Copy,
  CopyCheck,
  Eye,
  EyeOff,
  Heart,
  KeyRound,
  Pencil,
  Pin,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
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

export default function PasscodeDetailModal({
  isOpen,
  onClose,
  data,
  onEdit,
  onDelete,
  onToggleFavorite,
  setNewFavState,
}) {
  const [showPin, setShowPin] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedUsername, setCopiedUsername] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen || !data) return null;
  const { id, siteName, platform, usernames = [], pin, isFavorite: newFavState, strength } = data;
  const displayName = siteName || platform;
  const strengthCfg = strengthConfig(strength);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 p-4 backdrop-blur-md">
      <button className="absolute inset-0" onClick={onClose} aria-label="Close modal" />
      <div className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-cyan-200 bg-white shadow-2xl dark:border-cyan-900 dark:bg-gray-900 animate-scale-in">
        <div className="h-1.5 bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-600" />
        <div className="flex items-center gap-3 border-b border-gray-100 p-5 dark:border-gray-800">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20"><Pin className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-widest text-cyan-600">Passcode details</p><h2 className="truncate text-xl font-black text-gray-900 dark:text-white">{displayName}</h2></div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${strengthCfg.cls}`}>
              {strengthCfg.icon} {strengthCfg.label}
            </span>
            <button
              onClick={() => {
                onToggleFavorite({
                  idToToggle: id,
                  value: !newFavState,
                  onError: setNewFavState,
                });
                setNewFavState?.((state) => !state);
              }}
              className={`cursor-pointer p-2 rounded-xl transition-all duration-200 ${
                newFavState
                  ? "text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                  : "text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
              }`}
              aria-label={newFavState ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className="h-5 w-5 transition-all duration-300"
                fill={newFavState ? "#06b6d4" : "none"}
                stroke={newFavState ? "#06b6d4" : "currentColor"}
              />
            </button>
            <button onClick={onClose} className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-gray-800"><X className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {/* ── PIN card ── */}
          <div className="rounded-2xl border border-cyan-100 bg-linear-to-r from-cyan-50 to-indigo-50 p-4 dark:border-cyan-900/50 dark:from-cyan-950/30 dark:to-indigo-950/30">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">PIN / Passcode</p>
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 font-mono text-xl font-black tracking-[0.3em] text-indigo-800 dark:text-indigo-200">
                {showPin ? pin : "?".repeat(6)}
              </span>
              <button onClick={() => setShowPin((v) => !v)} className="cursor-pointer rounded-xl bg-white p-2 text-cyan-700 shadow-sm dark:bg-gray-800">
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={() => handleCopy(pin, setCopiedPin)} className="cursor-pointer rounded-xl bg-indigo-600 p-2 text-white">
                {copiedPin ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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

          {/* ── Usernames ── */}
          <div>
            <div className="mb-2 flex items-center gap-2"><UserRound className="h-4 w-4 text-cyan-600" /><h3 className="text-sm font-black text-gray-900 dark:text-white">Usernames / IDs ({usernames.length})</h3></div>
            <div className="space-y-2">
              {usernames.map((username, index) => (
                <div key={`${username}-${index}`} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800/70">
                  <span className="min-w-0 flex-1 truncate font-mono text-sm text-gray-700 dark:text-gray-200">{username}</span>
                  <button onClick={() => handleCopy(username, (copied) => setCopiedUsername(copied ? index : null))} className="cursor-pointer text-gray-400 hover:text-cyan-600">
                    {copiedUsername === index ? <CopyCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer - modern gradient buttons ── */}
        <div className="flex shrink-0 flex-wrap-reverse items-center gap-3 border-t border-gray-100 p-5 dark:border-gray-800">
          <button
            onClick={() => { onDelete({ id, siteName: displayName, usernames }); onClose(); }}
            className="flex min-w-1/2 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition-all duration-200 hover:bg-red-50 active:scale-95 dark:border-red-800/50 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4 shrink-0" /> Delete
          </button>
          <button
            onClick={() => { onEdit({ id, platform: displayName, usernames, pin }); onClose(); }}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cyan-500/30 active:scale-95"
          >
            <Pencil className="h-4 w-4 shrink-0" /> Edit Entry
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}