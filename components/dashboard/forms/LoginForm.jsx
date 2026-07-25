"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  TriangleAlert,
  UserPen,
  AlertCircle,
  Cpu,
  Copy,
  CopyCheck,
  Sparkles,
  X,
  ChevronDown,
} from "lucide-react";

// Context & Libs
import { useMasterPass } from "@/context/MasterPassword";
import SuggestPassword from "@/lib/passwords/suggestPassword";
import { handleSavePassword } from "@/lib/passwords/submitPasswords";
import { encryptV3 } from "@/lib/passwords/encryptPassV3";
import { generateAuthData } from "@/lib/masterpassword/mPasscryptoV3";
import categorizePassword from "@/lib/passwords/strengthChecker";

// Components
import MasterPasswordModel from "@/components/masterPassPage";
import CreateMasterPasswordModal from "@/components/CreateMasterPassword";
import { CreateMasterPass } from "@/lib/masterpassword/create";
import { capitalize, getPasswordStrength, handleCopy } from "@/lib/helper";
import ScrollReveal from "@/components/ScrollReveal";
import BlockedAccount from "@/components/BlockedAccountToast";

// ── Reusable Input Field ─────────────────────────────────────────────────────
function InputField({ label, icon, error, children, action }) {
  return (
    <div className="group space-y-1.5">
      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200">
          {icon}
          {label}
        </label>
        {action}
      </div>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1 px-1 font-medium">
          <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Input base classes ───────────────────────────────────────────────────────
const inputCls =
  "w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all duration-200 text-base placeholder:text-gray-300 dark:placeholder:text-gray-600";

const LoginForm = () => {
  const [seePassword, setseePassword] = useState(false);
  const [isPassSuggested, setIsPassSuggested] = useState(false);
  const [isPassCopied, setIsPassCopied] = useState(false);
  const [isUserNameCopied, setIsUserNameCopied] = useState(false);
  const [strengthMeterOpen, setStrengthMeterOpen] = useState(true);
  const { encKey, resetTimer, toCreateMasterPass, setToCreateMasterPass, masterPass } =
    useMasterPass();
  const [showMasterPassModel, setshowMasterPassModel] = useState(false);
  const [showCreateMasterModel, setShowCreateMasterModel] = useState(false);
  const { data: session, update } = useSession();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm();

  const passwordValue = watch("password", "");
  const usernameValue = watch("username", "");
  const entryStrength = useMemo(
    () => getPasswordStrength(passwordValue),
    [passwordValue],
  );

  const HandleSuggestStrongPassword = () => {
    const password = SuggestPassword();
    if (password) {
      setValue("password", password, { shouldValidate: true });
      setIsPassSuggested(true);
      setTimeout(() => setIsPassSuggested(false), 2000);
    }
  };

  const handleOnSubmit = async (formData) => {
    if (!encKey) {
      toCreateMasterPass
        ? setShowCreateMasterModel(true)
        : setshowMasterPassModel(true);
      return;
    }
    const strength = categorizePassword(formData.password);
    await toast.promise(
      handleSavePassword({
        site: await encryptV3(formData.site, encKey),
        username: await encryptV3(formData.username, encKey),
        password: await encryptV3(formData.password, encKey),
        strength: await encryptV3(strength, encKey),
      }),
      {
        loading: "Saving...",
        success: ({ message }) => {
          resetTimer();
          return message || "Saved Successfully!";
        },
        error: ({ message }) => {
          if (message === "BLOCKED_ACCOUNT") {
            return <BlockedAccount />;
          }
          return message || "Something went wrong";
        },
      },
    );
    reset();
  };

  return (
    <div className="max-w-360 flex flex-col items-center px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300 ">
      <div className="w-full grid grid-cols-1 gap-6 items-start pb-10">
        {/* ── RIGHT FORM ───────────────────────────────────────────────── */}
        <ScrollReveal
          direction="up"
          delayMs={80}
          className="lg:col-span-8 mb-6"
        >
          <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden pb-4">
            {/* Form header */}
            <div className="px-6 md:px-8 pt-7 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                  <LockKeyhole className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-gray-900 dark:text-white">
                    New Password Entry
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Encrypted with AES-256-GCM before saving
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete="off">
              {/* Browser autofill traps */}
              <input
                type="text"
                name="fakeuser"
                autoComplete="username"
                style={{ display: "none" }}
              />
              <input
                type="password"
                name="fakepass"
                autoComplete="new-password"
                style={{ display: "none" }}
              />

              <div className="grid grid-cols-2 px-8 gap-4">
                <div className="py-7 flex flex-col gap-6">
                  {/* Site Name */}
                  <InputField
                    label="Site Name"
                    icon={<Globe className="w-3.5 h-3.5" />}
                    error={errors.site?.message}
                  >
                    <input
                      {...register("site", {
                        required: "Site name is required",
                      })}
                      placeholder="e.g. Google, GitHub, Netflix"
                      className={inputCls}
                      autoComplete="off"
                    />
                  </InputField>

                  {/* Username */}
                  <InputField
                    label="Username / Email"
                    icon={<UserPen className="w-3.5 h-3.5" />}
                    error={errors.username?.message}
                    action={
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(usernameValue, setIsUserNameCopied)
                        }
                        disabled={!usernameValue || isUserNameCopied}
                        className={`flex items-center gap-1 text-xs font-semibold transition-all duration-200 ${
                          !usernameValue
                            ? "opacity-30 cursor-not-allowed text-gray-400"
                            : isUserNameCopied
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                        }`}
                      >
                        {isUserNameCopied ? (
                          <>
                            <CopyCheck className="w-3.5 h-3.5" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>
                    }
                  >
                    <input
                      {...register("username", {
                        required: "Username is required",
                      })}
                      placeholder="e.g. john@example.com"
                      className={inputCls}
                      autoComplete="off"
                    />
                  </InputField>

                  {/* Password */}
                  <InputField
                    label="Password"
                    icon={<KeyRound className="w-3.5 h-3.5" />}
                    error={errors.password?.message}
                    action={
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(passwordValue, setIsPassCopied)
                        }
                        disabled={!passwordValue || isPassCopied}
                        className={`flex items-center gap-1 text-xs font-semibold transition-all duration-200 ${
                          !passwordValue
                            ? "opacity-30 cursor-not-allowed text-gray-400"
                            : isPassCopied
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                        }`}
                      >
                        {isPassCopied ? (
                          <>
                            <CopyCheck className="w-3.5 h-3.5" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>
                    }
                  >
                    <div className="relative">
                      <input
                        {...register("password", {
                          required: "Password is required",
                        })}
                        type={seePassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Enter or generate a password"
                        className={`${inputCls} pr-12 font-mono`}
                      />
                      <button
                        type="button"
                        onClick={() => setseePassword(!seePassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        {seePassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </InputField>

                  {/* Suggest Password Button */}
                  <button
                    type="button"
                    onClick={HandleSuggestStrongPassword}
                    disabled={isPassSuggested}
                    className={`w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 ${
                      isPassSuggested
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 cursor-progress"
                        : "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
                    }`}
                  >
                    {isPassSuggested ? (
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

                <div className="py-7 flex flex-col gap-6">
                  {/* Strength Meter collapsible, CSS grid trick */}
                  <div
                    className={`grid transition-all duration-300 grid-rows-[1fr] opacity-100`}
                  >
                    <div className="overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Always-visible header row Score + toggle button */}
                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Security Score
                            </span>
                            <span
                              className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                                entryStrength.score > 70
                                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50"
                                  : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50"
                              }`}
                            >
                              {entryStrength.category
                                ? entryStrength.category
                                : "Awating Input..."}
                            </span>
                          </div>
                          {/* Toggle button X to close, ChevronDown to open */}
                          <button
                            type="button"
                            onClick={() =>
                              setStrengthMeterOpen((prev) => !prev)
                            }
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

                        {/* Collapsible body */}
                        <div
                          className={`grid transition-all duration-300 ${strengthMeterOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                        >
                          <div className="overflow-hidden">
                            <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                              {/* Progress bar */}
                              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-2 rounded-full transition-[width] duration-500 ease-out ${
                                    entryStrength.score > 75
                                      ? "bg-emerald-500"
                                      : entryStrength.score > 40
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{
                                    width: `${passwordValue && entryStrength.score === 0 ? "2" : entryStrength.score}%`,
                                  }}
                                />
                              </div>

                              {/* Warning */}
                              {entryStrength.result?.feedback?.warning && (
                                <div className="flex items-start gap-2 p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/50 animate-fade-in">
                                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                  <p className="text-xs font-medium text-red-600 dark:text-red-400 leading-snug">
                                    {entryStrength.result.feedback.warning}
                                  </p>
                                </div>
                              )}

                              {/* Suggestions */}
                              {entryStrength.result?.feedback?.suggestions
                                ?.length > 0 && (
                                <div className="space-y-1.5">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                    Suggestions
                                  </p>
                                  <div className="max-h-20 overflow-y-auto space-y-1 pr-1 scroll-bar-hide">
                                    {entryStrength.result.feedback.suggestions
                                      .filter(
                                        (item, i, self) =>
                                          self.indexOf(item) === i,
                                      )
                                      .map((suggestion, i) => (
                                        <div
                                          key={i}
                                          className="flex items-start gap-2 animate-fade-in"
                                        >
                                          <span className="w-1 h-1 bg-blue-400 rounded-full shrink-0 mt-1.5" />
                                          <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-snug">
                                            {suggestion}
                                          </p>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* Crack time */}
                              {entryStrength.result?.crack_times_display && (
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                  <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    <Cpu className="w-3 h-3" /> Estimated Time
                                    to Crack
                                  </p>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                                      <span className="text-[12px] text-gray-600 dark:text-gray-400 font-inter">
                                        Standard attack (10k/sec)
                                      </span>
                                      <span
                                        className={`text-xs font-bold ${entryStrength.score > 70 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                                      >
                                        {capitalize(
                                          entryStrength.result
                                            .crack_times_display
                                            .offline_slow_hashing_1e4_per_second,
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                                      <span className="text-[12px] text-gray-600 dark:text-gray-400 font-inter">
                                        Supercomputer (10B/sec)
                                      </span>
                                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                        {capitalize(
                                          entryStrength.result
                                            .crack_times_display
                                            .offline_fast_hashing_1e10_per_second,
                                        )}
                                      </span>
                                    </div>
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
              </div>

              <div className="px-8">
                {/* Save Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-base transition-all duration-300 ${
                    isSubmitting
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:scale-95"
                  }`}
                >
                  <LockKeyhole
                    className={`w-5 h-5 shrink-0 ${isSubmitting ? "animate-pulse" : ""}`}
                  />
                  <span>
                    {isSubmitting ? "Encrypting & Saving..." : "Save to Vault"}
                  </span>
                  {!isSubmitting && (
                    <ShieldCheck className="w-4 h-4 text-white/70 shrink-0" />
                  )}
                </button>
              </div>
            </form>
            {/* Encryption assurance note */}
            {!isSubmitting && (
              <p className="text-center text-[12px] text-gray-400 dark:text-gray-600 font-medium mt-4">
                🔒 Encrypted on your device before leaving
              </p>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default LoginForm;
