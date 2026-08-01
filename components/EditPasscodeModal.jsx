"use client";

import {
  AlertCircle,
  ChevronDown,
  Copy,
  CopyCheck,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import PinGeneratorControls from "@/components/PinGeneratorControls";
import { categorizePasscode } from "@/lib/passcodes/passcodeStrength";
import { handleCopy } from "@/lib/helper";

const inputClass =
  "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

export default function EditPasscodeModal({ isOpen, onClose, data, onSave }) {
  const [siteName, setSiteName] = useState("");
  const [usernames, setUsernames] = useState([""]);
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);
  const [isPasscodeSuggested, setIsPasscodeSuggested] = useState(false);
  const [strengthMeterOpen, setStrengthMeterOpen] = useState(true);
  const [copiedUsernameIndex, setCopiedUsernameIndex] = useState(null);

  const strength = useMemo(() => categorizePasscode(pin), [pin]);
  const canAddMore = (usernames[usernames.length - 1] ?? "").trim().length > 0;

  useEffect(() => {
    if (!isOpen || !data) return;
    setSiteName(data.platform || data.siteName || "");
    setUsernames(data.usernames?.length ? data.usernames : [""]);
    setPin(data.pin || "");
    setCopiedUsernameIndex(null);
    setStrengthMeterOpen(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  const handleSuggestStrongPasscode = (passcode) => {
    if (passcode) {
      if (/[a-zA-Z]/.test(passcode)) setIsAlpha(true);
      setPin(passcode);
      setIsPasscodeSuggested(true);
      setTimeout(() => setIsPasscodeSuggested(false), 800);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const cleanUsernames = usernames
      .map((username) => username.trim())
      .filter(Boolean);
    if (!siteName.trim() || !pin.trim() || cleanUsernames.length === 0) return;
    setSaving(true);
    try {
      const saved = await onSave({
        id: data.id,
        siteName: siteName.trim(),
        usernames: cleanUsernames,
        pin: pin.trim(),
      });
      if (saved) onClose();
    } finally {
      setSaving(false);
    }
  };

  const PinField = (
    <label className="block space-y-1.5">
      <span className="text-xs font-black text-gray-500">PIN / Passcode</span>
      <div className="relative">
        <input
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          type={showPin ? "text" : "password"}
          inputMode={isAlpha ? "text" : "numeric"}
          className={`${inputClass} pr-11 font-mono`}
          required
        />
        <button
          type="button"
          onClick={() => setShowPin((value) => !value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
          aria-label={showPin ? "Hide PIN" : "Show PIN"}
        >
          {showPin ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </label>
  );

  const PinGroup = (
    <>
      {PinField}
      <PinGeneratorControls
        isGenerated={isPasscodeSuggested}
        onPasscode={handleSuggestStrongPasscode}
      />
    </>
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 p-4 backdrop-blur-md">
      <button
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />
      <form
        onSubmit={submit}
        className="relative z-10 max-h-[80vh] w-full max-w-lg md:max-w-3xl overflow-y-auto scroll-bar-hide rounded-3xl border border-cyan-200 bg-white shadow-2xl dark:border-cyan-900 dark:bg-gray-900 animate-scale-in"
      >
        <div className="h-1.5 bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-600" />
        <div className="flex items-center border-b border-gray-100 p-5 dark:border-gray-800">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600">
              Secure entry
            </p>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Edit passcode
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full bg-gray-100 p-2 dark:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Left column: site + usernames + pin */}
            <div className="md:w-1/2 space-y-5">
              <label className="block space-y-1.5">
                <span className="text-xs font-black text-gray-500">
                  Service name
                </span>
                <input
                  value={siteName}
                  onChange={(event) => setSiteName(event.target.value)}
                  className={inputClass}
                  required
                />
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-black text-gray-500">
                    <UserRound className="h-3.5 w-3.5" />
                    Usernames / IDs
                  </span>
                  {canAddMore && (
                    <button
                      type="button"
                      onClick={() => setUsernames((values) => [...values, ""])}
                      className="flex cursor-pointer items-center gap-1 text-xs font-black text-cyan-600"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  )}
                </div>
                {usernames.map((username, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="relative flex-1">
                      <input
                        value={username}
                        onChange={(event) =>
                          setUsernames((values) =>
                            values.map((value, valueIndex) =>
                              valueIndex === index ? event.target.value : value,
                            ),
                          )
                        }
                        className={`${inputClass} pr-20`}
                        placeholder="Username / ID"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(username, (copied) =>
                            setCopiedUsernameIndex(copied ? index : null),
                          )
                        }
                        disabled={!username || copiedUsernameIndex === index}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-semibold transition-all duration-200 ${!username ? "opacity-30 cursor-not-allowed text-gray-400" : copiedUsernameIndex === index ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400"}`}
                      >
                        {copiedUsernameIndex === index ? (
                          <>
                            <CopyCheck className="h-3.5 w-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    {usernames.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setUsernames((values) =>
                            values.filter(
                              (_, valueIndex) => valueIndex !== index,
                            ),
                          )
                        }
                        className="shrink-0 cursor-pointer rounded-xl py-3 flex items-center text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {usernames.length <= 2 && PinGroup}
            </div>

            {/* Right column: pin (when >2 usernames) + strength meter */}
            <div className="md:w-1/2 space-y-5">
              {usernames.length > 2 && PinGroup}
              {/* Security Score meter */}
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Security Score
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full border ${strength.score > 70 ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50" : strength.score > 30 ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700/50" : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50"}`}
                    >
                      {pin ? strength.category : "Awaiting Input..."}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStrengthMeterOpen((prev) => !prev)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                    aria-label={
                      strengthMeterOpen
                        ? "Close strength meter"
                        : "Open strength meter"
                    }
                  >
                    {strengthMeterOpen ? (
                      <X className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div
                  className={`grid transition-all duration-300 ${strengthMeterOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-[width] duration-500 ease-out ${strength.score > 70 ? "bg-emerald-500" : strength.score > 30 ? "bg-orange-500" : "bg-red-500"}`}
                          style={{
                            width: `${pin && strength.score === 0 ? "2" : strength.score}%`,
                          }}
                        />
                      </div>
                      {strength.score > 0 && strength.score <= 30 && (
                        <div className="flex items-start gap-2 p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/50 animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-xs font-medium text-red-600 dark:text-red-400 leading-snug">
                            This passcode is weak and easily guessable. Use a
                            longer combination with mixed characters.
                          </p>
                        </div>
                      )}
                      {strength.score > 0 && strength.score <= 70 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                            Suggestions
                          </p>
                          <div className="space-y-1 pr-1">
                            {pin.length < 6 && /^[0-9]+$/.test(pin) && (
                              <div className="flex items-start gap-2 animate-fade-in">
                                <span className="w-1 h-1 bg-cyan-400 rounded-full shrink-0 mt-1.5" />
                                <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-snug">
                                  Consider 6+ digits for better security
                                </p>
                              </div>
                            )}
                            {pin.length >= 6 &&
                              pin.length < 8 &&
                              !/[a-zA-Z]/.test(pin) && (
                                <div className="flex items-start gap-2 animate-fade-in">
                                  <span className="w-1 h-1 bg-cyan-400 rounded-full shrink-0 mt-1.5" />
                                  <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-snug">
                                    Add letters/symbols for alphanumeric
                                    strength
                                  </p>
                                </div>
                              )}
                            {!/[a-zA-Z]/.test(pin) &&
                              pin.length >= 4 &&
                              pin.length <= 6 && (
                                <div className="flex items-start gap-2 animate-fade-in">
                                  <span className="w-1 h-1 bg-cyan-400 rounded-full shrink-0 mt-1.5" />
                                  <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-snug">
                                    Add letters to make it alphanumeric
                                  </p>
                                </div>
                              )}
                            {strength.category === "weak" &&
                              strength.score > 0 && (
                                <div className="flex items-start gap-2 animate-fade-in">
                                  <span className="w-1 h-1 bg-cyan-400 rounded-full shrink-0 mt-1.5" />
                                  <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-snug">
                                    Avoid common patterns, sequences, or
                                    repeated digits
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 p-5 dark:border-gray-800">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Encrypting & saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
