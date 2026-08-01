"use client";

import React, { useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import SuggestPassword from "@/lib/passwords/suggestPassword";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

const optionItems = [
  { key: "isUppercase", label: "Uppercase", sample: "A-Z" },
  { key: "isLowercase", label: "Lowercase", sample: "a-z" },
  { key: "isNumbers", label: "Numbers", sample: "0-9" },
  { key: "isSymbols", label: "Symbols", sample: "#@!" },
];

const defaultButtonClassName =
  "w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5";

const defaultGeneratedButtonClassName =
  "w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 cursor-progress";

const PasswordGeneratorControls = ({
  onPassword,
  isGenerated,
  className = "",
  buttonClassName = defaultButtonClassName,
  generatedButtonClassName = defaultGeneratedButtonClassName,
}) => {
  const [settings, setSettings] = useState({
    length: 20,
    isUppercase: true,
    isLowercase: true,
    isNumbers: true,
    isSymbols: true,
  });

  const selectedCount = optionItems.filter((item) => settings[item.key]).length;

  const handleToggle = (key) => {
    setSettings((prev) => {
      if (prev[key] && selectedCount === 1) return prev;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const handleGenerate = () => {
    const password = SuggestPassword(settings);
    if (password) onPassword(password);
  };

  return (
    <div
      className={`w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 py-3 px-2 sm:px-3 space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor="password-length"
          className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
          Length
        </label>
        <span className="text-xs font-black px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-700/50 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {settings.length}
        </span>
      </div>

      <input
        id="password-length"
        type="range"
        min={MIN_PASSWORD_LENGTH}
        max={MAX_PASSWORD_LENGTH}
        value={settings.length}
        onChange={(event) =>
          setSettings((prev) => ({
            ...prev,
            length: Number(event.target.value),
          }))
        }
        className={`w-full ${12 > settings.length ? "accent-red-600" : 16 > settings.length ? "accent-orange-600" : 20 > settings.length ? "accent-blue-600" : "accent-emerald-600"}`}
      />

      <div className="flex flex-wrap gap-2">
        {optionItems.map((item) => (
          <label
            key={item.key}
            className="flex items-center gap-2 flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 text-nowrap"
          >
            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={() => handleToggle(item.key)}
                className="peer h-full w-full cursor-pointer appearance-none rounded-md border-2 border-gray-300 bg-white transition-all duration-300 checked:border-emerald-500 checked:bg-emerald-600 hover:border-emerald-700 dark:checked:border-emerald-600 dark:checked:bg-emerald-700 dark:hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-1 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-offset-gray-900"
              />
              <svg
                className="pointer-events-none absolute h-3 w-3 text-white opacity-0 scale-50 transition-all duration-300 peer-checked:opacity-100 peer-checked:scale-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="flex-1">{item.label}</span>
            <span className="text-[10px] font-black text-gray-400">
              {item.sample}
            </span>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerated}
        className={isGenerated ? generatedButtonClassName : buttonClassName}
      >
        {isGenerated ? (
          <>
            <ShieldCheck className="w-4 h-4 animate-bounce shrink-0" />
            Password Suggested!
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 shrink-0" />
            Suggest Strong Password
          </>
        )}
      </button>
    </div>
  );
};

export default PasswordGeneratorControls;
