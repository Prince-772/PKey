"use client";

import { handleCopy } from "@/lib/helper";
import {
  Copy,
  CopyCheck,
  Eye,
  EyeOff,
  Heart,
  Info,
  Pencil,
  Pin,
  Trash2,
  UserRound,
} from "lucide-react";
import { memo, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import PasscodeDetailModal from "./PasscodeDetailModal";

const PasscodeCard = ({
  id,
  platform,
  usernames = [],
  pin,
  isFav,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [isPinCopied, setIsPinCopied] = useState(false);
  const [copiedUsernameIndex, setCopiedUsernameIndex] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newFavState, setNewFavState] = useState(isFav);

  const editData = { id, platform, usernames, pin };
  const deleteData = { id, siteName: platform, usernames };

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-200/70 bg-linear-to-r from-cyan-50 via-white to-indigo-50 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 dark:border-cyan-900/60 dark:from-cyan-950/30 dark:via-gray-900 dark:to-indigo-950/30 dark:hover:border-cyan-700">
      <div className="h-1 bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-600" />
      <div className="flex items-center gap-3 p-3 md:p-4">
        <button
          type="button"
          onClick={() => {
            onToggleFavorite({
              idToToggle: id,
              value: !newFavState,
              onError: setNewFavState,
            });
            setNewFavState((state) => !state);
          }}
          aria-label={newFavState ? "Remove from favorites" : "Add to favorites"}
          className="cursor-pointer"
        >
          <ScrollReveal direction="right">
            <Heart
              className="h-5 w-5 transition-all"
              fill={newFavState ? "#ec4899" : "none"}
              stroke={newFavState ? "#ec4899" : "currentColor"}
            />
          </ScrollReveal>
        </button>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-200 bg-linear-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 dark:border-cyan-700">
          <Pin className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-black text-gray-900 dark:text-white md:text-base">
              {platform}
            </h3>
            <span className="rounded-full border border-cyan-200 bg-cyan-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-cyan-700 dark:border-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
              Passcode
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {usernames.slice(0, 2).map((username, index) => (
              <button
                type="button"
                key={`${username}-${index}`}
                onClick={() =>
                  handleCopy(username, (copied) =>
                    setCopiedUsernameIndex(copied ? index : null),
                  )
                }
                className="flex max-w-32 cursor-pointer items-center gap-1 rounded-lg border border-gray-200/70 bg-white/80 px-2 py-1 text-[11px] font-semibold text-gray-600 hover:border-cyan-300 hover:text-cyan-700 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300"
              >
                <UserRound className="h-3 w-3 shrink-0" />
                <span className="truncate">{username}</span>
                {copiedUsernameIndex === index ? (
                  <CopyCheck className="h-3 w-3 shrink-0 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 shrink-0 text-gray-400" />
                )}
              </button>
            ))}
            {usernames.length > 2 && (
              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                className="cursor-pointer text-[11px] font-black text-cyan-700 hover:text-indigo-600 dark:text-cyan-400"
              >
                +{usernames.length - 2} view more
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="hidden min-w-16 text-right font-mono text-sm font-black tracking-[0.22em] text-indigo-800 dark:text-indigo-200 sm:block">
            {isPinVisible ? pin : "????"}
          </span>
          <button type="button" onClick={() => setIsPinVisible((visible) => !visible)} aria-label={isPinVisible ? "Hide passcode" : "Show passcode"} className="cursor-pointer rounded-full bg-cyan-100 p-2 text-cyan-700 hover:bg-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300">
            {isPinVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => handleCopy(pin, setIsPinCopied)} aria-label="Copy passcode" className="cursor-pointer rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-700">
            {isPinCopied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => setDetailOpen(true)} aria-label="View passcode details" className="hidden cursor-pointer rounded-full bg-gray-600 p-2 text-white hover:bg-gray-700 md:block">
            <Info className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onEdit(editData)} aria-label="Edit passcode" className="cursor-pointer rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onDelete(deleteData)} aria-label="Delete passcode" className="cursor-pointer rounded-full bg-red-600 p-2 text-white hover:bg-red-700">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isPinVisible && (
        <div className="border-t border-cyan-100 bg-white/50 px-4 py-2 text-center font-mono text-base font-black tracking-[0.28em] text-indigo-700 dark:border-cyan-900/50 dark:bg-gray-900/40 dark:text-indigo-300 sm:hidden">
          {pin}
        </div>
      )}
      {detailOpen && (
        <PasscodeDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          data={{ ...editData, siteName: platform, isFavorite: newFavState }}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default memo(PasscodeCard);
