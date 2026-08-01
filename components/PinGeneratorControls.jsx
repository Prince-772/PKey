"use client";

import React, { useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import suggestPasscode from "@/lib/passcodes/suggestPasscode";

const MIN_PIN_LENGTH = 4;
const MAX_PIN_LENGTH = 32;

const charsetOptions = [
  { id: "numeric", label: "Numeric", sample: "0-9" },
  { id: "alphanumeric", label: "Alphanumeric", sample: "aZ 0-9" },
  { id: "complex", label: "Complex", sample: "aZ 0-9 #@!" },
];

const PinGeneratorControls = ({
  onPasscode,
  isGenerated,
  className = "",
}) => {
  const [length, setLength] = useState(8);
  const [charset, setCharset] = useState("numeric");

  const handleGenerate = () => {
    const passcode = suggestPasscode({ length, charset });
    if (passcode) onPasscode(passcode);
  };

  return (
    <div
      className={`w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 py-3 px-3 sm:px-4 space-y-3 ${className}`}
    >
      {/* Length row */}
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor="pin-length"
          className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
          Length
        </label>
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-700/50 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
          {length}
        </span>
      </div>

      <input
        id="pin-length"
        type="range"
        min={MIN_PIN_LENGTH}
        max={MAX_PIN_LENGTH}
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
        className={`w-full ${
          6 > length
            ? "accent-red-600"
            : 10 > length
            ? "accent-orange-600"
            : 14 > length
            ? "accent-blue-600"
            : "accent-emerald-600"
        }`}
      />

      {/* Character set chips - smaller and responsive */}
      <div className="grid grid-cols-3 gap-1.5">
        {charsetOptions.map((opt) => (
          <button
            type="button"
            key={opt.id}
            onClick={() => setCharset(opt.id)}
            className={`rounded-lg border px-2 py-1.5 text-[10px] font-semibold transition-all cursor-pointer text-nowrap flex flex-col items-center gap-0.5 ${
              charset === opt.id
                ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-cyan-400 dark:hover:border-cyan-600"
            }`}
          >
            <span className="block leading-tight">{opt.label}</span>
            <span className="block text-[9px] opacity-70 font-normal">
              {opt.sample}
            </span>
          </button>
        ))}
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerated}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 ${
          isGenerated
            ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 cursor-progress"
            : "bg-linear-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
        }`}
      >
        {isGenerated ? (
          <>
            <ShieldCheck className="w-3.5 h-3.5 animate-bounce shrink-0" />
            Passcode Suggested!
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            Suggest Strong Passcode
          </>
        )}
      </button>
    </div>
  );
};

export default PinGeneratorControls;