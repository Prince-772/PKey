import { Copy, CopyCheck, Eye, EyeOff, Heart, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { memo, useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

const PasswordCard = ({ id, platform, username, password, isFav, onEdit, onDelete, onToggleFavorite }) => {

  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isPassCopied, setIsPassCopied] = useState(false);
  const [isUserNameCopied, setIsUserNameCopied] = useState(false);
  const [isSlided, setIsSlided] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsSlided(true),
    onSwipedRight: () => setIsSlided(false),
    delta: 50
  });


  const handleCopy = async (text, setCopied) => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        const input = document.createElement("textarea");
        input.value = text;
        input.setAttribute("readonly", "");
        input.style.position = "absolute";
        input.style.left = "-9999px";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Copy failed:", err);
    }
  };

  return (
    <div {...handlers} className=" w-full backdrop-blur-md max-w-2xl mx-auto overflow-hidden">
      <div className={`flex transition-transform  duration-200 ease-in-out ${isSlided ? "-translate-x-24 md:translate-x-0" : "translate-x-0"}`}>
        <button
          className={`absolute top-2 left-2 cursor-pointer z-2`}
          onClick={() => onToggleFavorite(id, !isFav)}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className="w-5 h-5 transition-all duration-300"
            fill={isFav ? "red" : "none"}
            stroke={isFav ? "red" : "currentColor"}
          />
        </button>

        <div
          onClick={() => setIsSlided(prev => !prev)}
          className="w-full relative max-w-2xl border border-black dark:border-white shadow-lg rounded-xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white
                    hover:from-blue-700/30 hover:to-purple-700/30 overflow-hidden
                    dark:from-blue-500/20 dark:to-purple-500/20 dark:hover:from-blue-600/20 dark:hover:to-purple-600/20 p-3 md:p-6 flex justify-between items-start gap-4 transition-all hover:shadow-2xl duration-300">

          {/*Logo + Info */}
          <div className="flex items-center max-w-full gap-4 flex-1">
            {/* Logo */}
            <div className="relative w-12 md:w-16 aspect-square rounded-full overflow-hidden bg-white shadow-inner border border-gray-300">
              <Image
                src={`https://icons.duckduckgo.com/ip3/${platform}.ico`}
                alt="Logo"
                fill
                className="object-contain"
                sizes="100%"
              />
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center overflow-hidden w-full">
              <h2 className="text-base md:text-lg font-semibold truncate
               bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400
               w-[calc(100%-4rem)] md:w-[calc(100%-6rem)]">
                {platform}
              </h2>

              <div className="flex items-center gap-1 md:gap-2 mt-2">
                {!isUserNameCopied ? (
                  <Copy
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering parent click events
                      handleCopy(username, setIsUserNameCopied);
                    }}
                    className="w-4 h-4 shrink-0
               text-gray-500 dark:text-gray-400
               hover:text-blue-600 dark:hover:text-blue-300
               cursor-pointer transform hover:scale-110
               transition-all duration-200"
                    role="button"
                    aria-label="Copy username"
                  />
                ) : (
                  <CopyCheck
                    onClick={(e) => e.stopPropagation()} // Still prevent parent clicks
                    className="w-4 h-4 shrink-0
               text-emerald-500 dark:text-emerald-400
               transition-colors duration-200"
                    role="status"
                    aria-label="Username copied"
                  />
                )}

                <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 truncate">
                  {username}
                </span>
              </div>

              {/* Password Section */}
              <div className="mt-2 flex items-center justify-between relative"> {/* Added justify-between for spacing */}
                {/* Password Display */}
                <span className="text-gray-900 dark:text-gray-100 md:text-lg tracking-wider select-none font-mono truncate flex-grow mr-2"> {/* flex-grow and mr-2 for spacing */}
                  {isPassVisible ? password : "•".repeat(password.length)}
                </span>

                {/* Actions Buttons (grouped for better layout) */}
                <div className="flex gap-3 ml-auto"> {/* Used ml-auto to push to right */}
                  {/* Toggle Password Visibility */}
                  {isPassVisible ? (
                    <EyeOff
                      onClick={(e) => { e.stopPropagation(); setIsPassVisible(false); }}
                      className="w-5 h-5 shrink-0
               text-gray-500 dark:text-gray-400
               hover:text-blue-600 dark:hover:text-blue-300
               cursor-pointer transform hover:scale-110
               transition-all duration-200"
                      role="button"
                      aria-label="Hide password"
                    />
                  ) : (
                    <Eye
                      onClick={(e) => { e.stopPropagation(); setIsPassVisible(true); }}
                      className="w-5 h-5 shrink-0
               text-gray-500 dark:text-gray-400
               hover:text-blue-600 dark:hover:text-blue-300
               cursor-pointer transform hover:scale-110
               transition-all duration-200"
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
               transition-all duration-200"
                      role="button"
                      aria-label="Copy password"
                    />
                  ) : (
                    <CopyCheck
                      onClick={(e) => e.stopPropagation()} // Still prevent parent clicks
                      className="w-5 h-5 shrink-0
               text-emerald-500 dark:text-emerald-400
               transition-colors duration-200"
                      role="status"
                      aria-label="Password copied"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex absolute top-3 right-3 items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit({ username, password, platform, id }) }}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors text-white">
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(id) }}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors text-white">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex md:hidden w-0 items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit({ username, password, platform, id }) }}
            className="p-2 ml-4 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors text-white">
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(id) }}
            className="p-2 mr-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors text-white">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(PasswordCard);
