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
  ExternalLink,
  ShieldCheck,
  ShieldOff,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { useSwipeable } from "react-swipeable";
import ScrollReveal from "./ScrollReveal";
import PasscodeDetailModal from "./PasscodeDetailModal";

const PasscodeCard = ({
  id,
  platform,
  usernames = [],
  pin,
  isFav,
  strength,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [isPinCopied, setIsPinCopied] = useState(false);
  const [copiedUsernameIndex, setCopiedUsernameIndex] = useState(null);
  const [isSlided, setIsSlided] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(true);
  const [newFavState, setNewFavState] = useState(isFav);

  const imgSrc = `https://icons.duckduckgo.com/ip3/${platform}.ico`;

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsSlided(true),
    onSwipedRight: () => setIsSlided(false),
    delta: 50,
  });

  const getValidUrl = (url) => {
    if (!url) return "#";
    url = url.trim();
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.includes(".") && !url.includes(" ")) return `https://${url}`;
    return url;
  };

  const getDisplayUrl = (url) => {
    if (!url) return "";
    return url.replace(/^https?:\/\//, "");
  };

  const editData = { id, platform, usernames, pin };
  const deleteData = { id, siteName: platform, usernames };

  return (
    <div
      {...handlers}
      className="w-full backdrop-blur-md max-w-2xl mx-auto overflow-hidden"
    >
      <div
        className={`flex transition-transform duration-300 ease-in-out ${
          isSlided ? "-translate-x-32 md:translate-x-0" : "translate-x-0"
        }`}
      >
        {/* Fav button top left, same as PasswordCard */}
        <button
          className="absolute top-2 left-2 cursor-pointer z-[2]"
          onClick={() => {
            onToggleFavorite({
              idToToggle: id,
              value: !newFavState,
              onError: setNewFavState,
            });
            setNewFavState((s) => !s);
          }}
          aria-label={newFavState ? "Remove from favorites" : "Add to favorites"}
        >
          <ScrollReveal direction="right">
            <Heart
              className="w-5 h-5 transition-all duration-300"
              fill={newFavState ? "#06b6d4" : "none"}
              stroke={newFavState ? "#06b6d4" : "currentColor"}
            />
          </ScrollReveal>
        </button>

        {/* Main cadr */}
        <div
          onClick={() => setIsSlided((prev) => !prev)}
          className="w-full relative max-w-2xl border border-cyan-500/40 dark:border-cyan-600/30 shadow-lg rounded-xl
            bg-linear-to-r from-cyan-600/25 to-indigo-600/25
            hover:from-cyan-700/30 hover:to-indigo-700/30
            dark:from-cyan-500/15 dark:to-indigo-500/15
            dark:hover:from-cyan-600/20 dark:hover:to-indigo-600/20
            p-3 md:p-6 flex justify-between items-start gap-4
            transition-all hover:shadow-2xl hover:shadow-cyan-500/10 duration-300 overflow-hidden"
        >
          {/* top accent strip differentiator from PasswordCard */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-600" />

          <div className="flex items-center max-w-full gap-4 flex-1">

            {/* Logo. same structure as PasswordCard */}
            <div className="relative flex w-12 md:w-16 aspect-square rounded-full overflow-hidden bg-linear-to-r to-cyan-600/20 from-indigo-600/20 shadow-inner border border-cyan-500/50">
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
                <div className="shrink-0 h-full w-full rounded-full bg-linear-to-br from-cyan-100 to-indigo-100 dark:from-cyan-900/40 dark:to-indigo-900/40 border border-cyan-200/50 dark:border-cyan-800/30 flex items-center justify-center text-3xl font-black text-cyan-600 dark:text-cyan-400 uppercase">
                  {platform?.[0] ?? "?"}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center overflow-hidden w-full">

              {/* Platform link same as PasswordCard */}
              <div className="relative">
                <div className="text-base md:text-lg font-semibold w-[calc(100%-2rem)] md:w-[calc(100%-9rem)]">
                  <div className="flex items-center relative cursor-default">
                    <div className="group flex items-center truncate">
                      <div className="flex items-center justify-center shrink-0 overflow-hidden
                        opacity-100 w-8
                        lg:w-0 lg:opacity-0 lg:mr-0
                        lg:group-hover:w-8 lg:group-hover:opacity-100
                        transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                      >
                        <Link
                          href={getValidUrl(platform)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center shrink-0
                            scale-100 lg:scale-50 lg:group-hover:scale-100
                            transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                            hover:rotate-12"
                        >
                          <div className="p-1 rounded-full bg-cyan-50 dark:bg-cyan-900/30 hover:bg-cyan-100 dark:hover:bg-cyan-800/50 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-500 dark:text-cyan-400" />
                          </div>
                        </Link>
                      </div>

                      <p className="inline-block relative bg-clip-text text-transparent bg-linear-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400 truncate">
                        {getDisplayUrl(platform)}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-500 to-indigo-500 group-hover:w-full transition-all duration-500 ease-out rounded-full" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usernames same pattern as PasswordCard */}
              <div className="flex flex-col gap-1 mt-2">
                {usernames.slice(0, 2).map((username, i) => (
                  <div key={i} className="flex items-center gap-1 md:gap-2">
                    {copiedUsernameIndex !== i ? (
                      <Copy
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(username, (val) =>
                            setCopiedUsernameIndex(val ? i : null)
                          );
                        }}
                        className="w-4 h-4 shrink-0 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer transform hover:scale-110 transition-all duration-300"
                        role="button"
                        aria-label={`Copy username ${i + 1}`}
                      />
                    ) : (
                      <CopyCheck
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400 transition-colors duration-300"
                        role="status"
                        aria-label={`Username ${i + 1} copied`}
                      />
                    )}
                    <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 truncate">
                      {username}
                    </span>
                  </div>
                ))}
                {usernames.length > 2 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDetailOpen(true); }}
                    className="mt-1 mx-1 text-xs md:text-sm font-medium
                      text-cyan-600 dark:text-cyan-400
                      bg-cyan-50 dark:bg-cyan-900/30
                      hover:bg-cyan-100 dark:hover:bg-cyan-800/50
                      hover:text-cyan-700 dark:hover:text-cyan-300
                      px-2 py-[1px] rounded-full
                      transition-all duration-300 ease-out hover:scale-105 active:scale-95
                      w-fit cursor-pointer
                      border border-cyan-200/50 dark:border-cyan-700/30"
                    aria-label={`View all ${usernames.length} usernames`}
                  >
                    +{usernames.length - 2} more
                  </button>
                )}
              </div>

              {/* PIN row same structure as password row in PasswordCard */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-cyan-500/20">
                {/* Passcode badge differentiator */}
                <span className="shrink-0 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  PIN
                </span>
                <span className="flex-1 font-mono text-sm font-semibold text-gray-800 dark:text-gray-200 truncate tracking-[0.15em]">
                  {isPinVisible ? pin : "?".repeat(6)}
                </span>
                <div className="flex gap-3 ml-auto">
                  {isPinVisible ? (
                    <EyeOff
                      onClick={(e) => { e.stopPropagation(); setIsPinVisible(false); }}
                      className="w-5 h-5 shrink-0 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer transform hover:scale-110 transition-all duration-300"
                      role="button"
                      aria-label="Hide PIN"
                    />
                  ) : (
                    <Eye
                      onClick={(e) => { e.stopPropagation(); setIsPinVisible(true); }}
                      className="w-5 h-5 shrink-0 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer transform hover:scale-110 transition-all duration-300"
                      role="button"
                      aria-label="Show PIN"
                    />
                  )}
                  {!isPinCopied ? (
                    <Copy
                      onClick={(e) => { e.stopPropagation(); handleCopy(pin, setIsPinCopied); }}
                      className="w-5 h-5 shrink-0 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer transform hover:scale-110 transition-all duration-300"
                      role="button"
                      aria-label="Copy PIN"
                    />
                  ) : (
                    <CopyCheck
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 shrink-0 text-emerald-500 dark:text-emerald-400 transition-colors duration-300"
                      role="status"
                      aria-label="PIN copied"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop action buttons top right */}
          <div className="flex absolute top-3 right-3 items-center gap-2">
            {/* Strength badge */}
            {strength && (
              <ScrollReveal direction="down" delayMs={300}>
                <div
                  tabIndex={0}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className={`relative p-2 rounded-full ${strength === "weak" ? "bg-red-500" : strength === "moderate" ? "bg-yellow-500" : "bg-green-600"} group transition-colors duration-300 cursor-pointer text-white`}
                >
                  {strength === "weak" && <ShieldOff className="w-4 h-4 text-white" />}
                  {strength === "moderate" && <AlertTriangle className="w-4 h-4 text-white" />}
                  {strength === "strong" && <ShieldCheck className="w-4 h-4 text-white" />}
                  <p className={`absolute top-0 right-10 ${strength === "weak" ? "bg-red-500/70" : strength === "moderate" ? "bg-yellow-500/70" : "bg-green-600/70"} text-nowrap text-black py-1 px-2 rounded-lg text-sm hidden group-hover:block group-focus:block`}>
                    This passcode is {strength}.
                  </p>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal direction="down" delayMs={200} className="hidden md:block">
              <button
                onClick={(e) => { e.stopPropagation(); setDetailOpen(true); }}
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors duration-300 cursor-pointer text-white"
              >
                <Info className="w-4 h-4" />
              </button>
            </ScrollReveal>

            <ScrollReveal direction="down" delayMs={100} className="hidden md:block">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(editData); }}
                className="p-2 rounded-full bg-cyan-600 hover:bg-cyan-700 transition-colors duration-300 cursor-pointer text-white"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </ScrollReveal>

            <ScrollReveal direction="down" delayMs={0} className="hidden md:block">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(deleteData); }}
                className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-300 cursor-pointer text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </ScrollReveal>
          </div>
        </div>

        {/* Mobile swipe revealed buttons same as PasswordCard */}
        <div className="flex md:hidden w-0 items-center">
          <ScrollReveal direction="down">
            <button
              onClick={(e) => { e.stopPropagation(); setDetailOpen(true); }}
              className="p-2 ml-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors duration-300 cursor-pointer text-white"
            >
              <Info className="w-4 h-4" />
            </button>
          </ScrollReveal>

          <ScrollReveal direction="down">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(editData); }}
              className="p-2 ml-2 rounded-full bg-cyan-600 hover:bg-cyan-700 transition-colors duration-300 cursor-pointer text-white"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </ScrollReveal>

          <ScrollReveal direction="down">
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(deleteData); }}
              className="p-2 ml-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-300 cursor-pointer text-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </ScrollReveal>
        </div>
      </div>

      {detailOpen && (
        <PasscodeDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          data={{ ...editData, siteName: platform, isFavorite: newFavState, strength }}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          setNewFavState={setNewFavState}
        />
      )}
    </div>
  );
};

export default memo(PasscodeCard);