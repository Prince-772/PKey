import { handleCopy } from "@/lib/helper";
import {
  AlertTriangle,
  Copy,
  CopyCheck,
  ExternalLink,
  Eye,
  EyeOff,
  Heart,
  Pencil,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { memo, useState } from "react";
import { useSwipeable } from "react-swipeable";
import ScrollReveal from "./ScrollReveal";
import Link from "next/link";

const PasswordCard = ({
  id,
  platform,
  username,
  password,
  isFav,
  onEdit,
  onDelete,
  onToggleFavorite,
  strength,
}) => {
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isPassCopied, setIsPassCopied] = useState(false);
  const [isUserNameCopied, setIsUserNameCopied] = useState(false);
  const [isSlided, setIsSlided] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    `https://icons.duckduckgo.com/ip3/${platform}.ico`,
  );
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
        className={`flex transition-transform  duration-300 ease-in-out ${isSlided ? "-translate-x-24 md:translate-x-0" : "translate-x-0"}`}
      >
        <button
          className={`absolute top-2 left-2 cursor-pointer z-2`}
          onClick={() => onToggleFavorite(id, !isFav)}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <ScrollReveal direction="right">
            <Heart
              className="w-5 h-5 transition-all duration-300"
              fill={isFav ? "red" : "none"}
              stroke={isFav ? "red" : "currentColor"}
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
            <div className="relative w-12 md:w-16 aspect-square rounded-full overflow-hidden bg-linear-to-r to-blue-600/20 from-purple-600/20 shadow-inner border border-purple-600">
              <Image
                src={imgSrc}
                alt="Logo"
                fill
                className="object-contain scale-80"
                sizes="100%"
                onError={() => setImgSrc("/images/fallback_logo.webp")}
              />
            </div>

            <div className="flex flex-col justify-center overflow-hidden w-full">
              <div className="relative">
                <div
                  className="text-base md:text-lg font-semibold truncate
    w-[calc(100%-4rem)] md:w-[calc(100%-6rem)]"
                >
                  <div className="flex items-center relative cursor-default">
                    {/* Animated link icon wrapper */}
                    <div className="group flex items-center">
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
                      <p className="inline-block relative bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        {getDisplayUrl(platform)}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500 ease-out rounded-full" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-2 mt-2">
                {!isUserNameCopied ? (
                  <Copy
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(username, setIsUserNameCopied);
                    }}
                    className="w-4 h-4 shrink-0
               text-gray-500 dark:text-gray-400
               hover:text-blue-600 dark:hover:text-blue-300
               cursor-pointer transform hover:scale-110
               transition-all duration-300"
                    role="button"
                    aria-label="Copy username"
                  />
                ) : (
                  <CopyCheck
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 shrink-0
               text-emerald-500 dark:text-emerald-400
               transition-colors duration-300"
                    role="status"
                    aria-label="Username copied"
                  />
                )}

                <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 truncate">
                  {username}
                </span>
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
            <ScrollReveal direction="down" delayMs={200}>
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
            <ScrollReveal
              direction="down"
              delayMs={100}
              className="hidden md:block"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit({ username, password, platform, id });
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
                  onDelete(id);
                }}
                className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-300 cursor-pointer text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </ScrollReveal>
          </div>
        </div>

        <div className="flex md:hidden w-0 items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit({ username, password, platform, id });
            }}
            className="p-2 ml-4 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="p-2 mr-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(PasswordCard);
