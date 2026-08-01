import { handleCopy } from "@/lib/helper";
import {
  AlertTriangle,
  Copy,
  CopyCheck,
  ExternalLink,
  Eye,
  EyeOff,
  Heart,
  Info,
  Pencil,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { memo, useState } from "react";
import { useSwipeable } from "react-swipeable";
import ScrollReveal from "./ScrollReveal";
import PasswordDetailModal from "@/components/PasswordDetailModal";
import Link from "next/link";

const PasswordCard = ({
  id,
  platform,
  usernames,
  password,
  isFav,
  onEdit,
  onDelete,
  onToggleFavorite,
  strength,
}) => {
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isPassCopied, setIsPassCopied] = useState(false);
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

    // Trim whitespace
    url = url.trim();

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    if (url.includes(".") && !url.includes(" ")) {
      return `https://${url}`;
    }

    return url;
  };

  const getDisplayUrl = (url) => {
    if (!url) return "";
    return url.replace(/^https?:\/\//, "");
  };

  return (
    <div
      {...handlers}
      className=" w-full backdrop-blur-md max-w-2xl mx-auto overflow-hidden"
    >
      <div
        className={`flex transition-transform  duration-300 ease-in-out ${isSlided ? "-translate-x-32 md:translate-x-0" : "translate-x-0"}`}
      >
        <button
          className={`absolute top-2 left-2 cursor-pointer z-2`}
          onClick={() => {
            onToggleFavorite({
              idToToggle: id,
              value: !newFavState,
              onError: setNewFavState,
            });
            setNewFavState((state) => !state);
          }}
          aria-label={
            newFavState ? "Remove from favorites" : "Add to favorites"
          }
        >
          <ScrollReveal direction="right">
            <Heart
              className="w-5 h-5 transition-all duration-300"
              fill={newFavState ? "red" : "none"}
              stroke={newFavState ? "red" : "currentColor"}
            />
          </ScrollReveal>
        </button>

        <div
          onClick={() => setIsSlided((prev) => !prev)}
          className="w-full relative max-w-2xl border border-black dark:border-white shadow-lg rounded-xl bg-linear-to-r from-blue-600/30 to-purple-600/30 text-white
                    hover:from-blue-700/30 hover:to-purple-700/30 overflow-hidden
                    dark:from-blue-500/20 dark:to-purple-500/20 dark:hover:from-blue-600/20 dark:hover:to-purple-600/20 p-3 md:p-6 flex justify-between items-start gap-4 transition-all hover:shadow-2xl duration-300"
        >
          <div className="flex items-center max-w-full gap-4 flex-1">
            {/* Logo */}
            <div className="relative flex w-12 md:w-16 aspect-square rounded-full overflow-hidden bg-linear-to-r to-blue-600/20 from-purple-600/20 shadow-inner border border-purple-600">
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
                <div className="shrink-0 h-full w-full  rounded-full bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 border border-blue-200/50 dark:border-blue-800/30 flex items-center justify-center text-3xl font-black text-blue-600 dark:text-blue-400 uppercase">
                  {platform?.[0] ?? "?"}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center overflow-hidden w-full">
              <div className="relative">
                <div
                  className="text-base md:text-lg font-semibold
    w-[calc(100%-2rem)] md:w-[calc(100%-9rem)]"
                >
                  <div className="flex items-center relative cursor-default">
                    {/* Animated link icon wrapper */}
                    <div className="group flex items-center truncate">
                      <div
                        className="
    flex items-center justify-center shrink-0 overflow-hidden
    opacity-100 w-8
    lg:w-0 lg:opacity-0 lg:mr-0
    lg:group-hover:w-8 lg:group-hover:opacity-100
    transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]
  "
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
                          <div className="p-1 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 dark:text-blue-400" />
                          </div>
                        </Link>
                      </div>

                      {/* Text Section */}
                      <p className="inline-block relative bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 truncate">
                        {getDisplayUrl(platform)}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500 ease-out rounded-full" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                {usernames.slice(0, 2).map((username, i) => (
                  <div key={i} className="flex items-center gap-1 md:gap-2">
                    {copiedUsernameIndex !== i ? (
                      <Copy
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(username, (val) =>
                            setCopiedUsernameIndex(val ? i : null),
                          );
                        }}
                        className="w-4 h-4 shrink-0
               text-gray-500 dark:text-gray-400
               hover:text-blue-600 dark:hover:text-blue-300
               cursor-pointer transform hover:scale-110
               transition-all duration-300"
                        role="button"
                        aria-label={`Copy username ${i + 1}`}
                      />
                    ) : (
                      <CopyCheck
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 shrink-0
               text-emerald-500 dark:text-emerald-400
               transition-colors duration-300"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailOpen(true);
                    }}
                    className="mt-1 mx-1 text-xs md:text-sm font-medium 
                               text-blue-600 dark:text-blue-400
                               bg-blue-50 dark:bg-blue-900/30
                               hover:bg-blue-100 dark:hover:bg-blue-800/50
                               hover:text-blue-700 dark:hover:text-blue-300
                               px-2 py-[1px] rounded-full 
                               transition-all duration-300 ease-out
                               hover:scale-105 active:scale-95
                               w-fit cursor-pointer
                               border border-blue-200/50 dark:border-blue-700/30"
                    aria-label={`View all ${usernames.length} usernames`}
                  >
                    +{usernames.length - 2} more
                  </button>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between relative">
                <span className="text-gray-900 dark:text-gray-100 md:text-lg tracking-wider select-none font-mono truncate grow mr-2 whitespace-pre">
                  {isPassVisible ? password : "•".repeat(12)}
                </span>

                <div className="flex gap-3 ml-auto">
                  {isPassVisible ? (
                    <EyeOff
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPassVisible(false);
                      }}
                      className="w-5 h-5 shrink-0
               text-gray-500 dark:text-gray-400
               hover:text-blue-600 dark:hover:text-blue-300
               cursor-pointer transform hover:scale-110
               transition-all duration-300"
                      role="button"
                      aria-label="Hide password"
                    />
                  ) : (
                    <Eye
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPassVisible(true);
                      }}
                      className="w-5 h-5 shrink-0
               text-gray-500 dark:text-gray-400
               hover:text-blue-600 dark:hover:text-blue-300
               cursor-pointer transform hover:scale-110
               transition-all duration-300"
                      role="button"
                      aria-label="Show password"
                    />
                  )}

                  {!isPassCopied ? (
                    <Copy
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(password, setIsPassCopied);
                      }}
                      className="w-5 h-5 shrink-0
               text-gray-500 dark:text-gray-400
               hover:text-blue-600 dark:hover:text-blue-300
               cursor-pointer transform hover:scale-110
               transition-all duration-300"
                      role="button"
                      aria-label="Copy password"
                    />
                  ) : (
                    <CopyCheck
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 shrink-0
               text-emerald-500 dark:text-emerald-400
               transition-colors duration-300"
                      role="status"
                      aria-label="Password copied"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex absolute top-3 right-3 items-center gap-2">
            {strength && (
              <ScrollReveal direction="down" delayMs={300}>
                <div
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={`relative p-2 rounded-full ${strength === "weak" ? "bg-red-500" : strength === "moderate" ? "bg-yellow-500" : "bg-green-600"} group transition-colors duration-300 cursor-pointer text-white`}
                >
                  {strength === "weak" && (
                    <ShieldOff className="w-4 h-4 text-white" />
                  )}
                  {strength === "moderate" && (
                    <AlertTriangle className="w-4 h-4 text-white" />
                  )}
                  {strength === "strong" && (
                    <ShieldCheck className="w-4 h-4 text-white" />
                  )}
                  <p
                    className={`absolute top-0 right-10 ${strength === "weak" ? "bg-red-500/70" : strength === "moderate" ? "bg-yellow-500/70" : "bg-green-600/70"} text-nowrap text-black py-1 px-2 rounded-lg text-sm hidden group-hover:block group-focus:block`}
                  >
                    This password is {strength}.
                  </p>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal
              direction="down"
              delayMs={200}
              className="hidden md:block"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailOpen(true);
                }}
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors duration-300 cursor-pointer text-white"
              >
                <Info className="w-4 h-4" />
              </button>
            </ScrollReveal>

            <ScrollReveal
              direction="down"
              delayMs={100}
              className="hidden md:block"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit({ usernames, password, platform, id });
                }}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 cursor-pointer text-white"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </ScrollReveal>

            <ScrollReveal
              direction="down"
              delayMs={0}
              className="hidden md:block"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete({ id, siteName: platform, usernames });
                }}
                className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-300 cursor-pointer text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </ScrollReveal>
          </div>
        </div>

        <div className="flex md:hidden w-0 items-center">
          <ScrollReveal direction="down">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDetailOpen(true);
              }}
              className="p-2 ml-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors duration-300 cursor-pointer text-white"
            >
              <Info className="w-4 h-4" />
            </button>
          </ScrollReveal>

          <ScrollReveal direction="down">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit({ usernames, password, platform, id });
              }}
              className="p-2 ml-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 cursor-pointer text-white"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </ScrollReveal>

          <ScrollReveal direction="down">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete({ id, siteName: platform, usernames });
              }}
              className="p-2 ml-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-300 cursor-pointer text-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </ScrollReveal>
        </div>
      </div>
      {detailOpen && (
        <PasswordDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          data={{
            siteName: platform,
            usernames,
            password,
            isFavorite: newFavState,
            strength,
            id,
          }}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          setNewFavState={setNewFavState}
        />
      )}
    </div>
  );
};

export default memo(PasswordCard);
