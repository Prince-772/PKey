import React, { useCallback, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useMasterPass } from "@/context/MasterPassword";
import { usePasscodes } from "@/context/PasscodesProvider.jsx";
import { encryptV3 } from "@/lib/passwords/encryptPassV3";
import { categorizePasscode } from "@/lib/passcodes/passcodeStrength";
import { handleCopy } from "@/lib/helper";
import PinGeneratorControls from "@/components/PinGeneratorControls";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Eye,
  EyeOff,
  KeyRound,
  Trash2,
  Plus,
  UserPen,
  LockKeyhole,
  Sparkles,
  ShieldCheck,
  TriangleAlert,
  Copy,
  CopyCheck,
  AlertCircle,
  ChevronDown,
  X,
} from "lucide-react";

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
        <p className="flex items-center gap-1.5 px-1 mt-1 text-xs font-medium text-red-500">
          <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all duration-200 text-base placeholder:text-gray-300 dark:placeholder:text-gray-600";

export default function PinForm() {
  const {
    encKey,
    setShowMasterPassModel,
    toCreateMasterPass,
    setShowCreateMasterModel,
    resetTimer,
  } = useMasterPass();
  const { fetchPasscodes } = usePasscodes();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      usernames: [{ value: "" }],
      pin: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "usernames",
  });

  const [seePin, setSeePin] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);
  const [isPinCopied, setIsPinCopied] = useState(false);
  const [isPasscodeSuggested, setIsPasscodeSuggested] = useState(false);
  const [strengthMeterOpen, setStrengthMeterOpen] = useState(true);
  const [copiedUsernameIndex, setCopiedUsernameIndex] = useState(null);

  const pinValue = watch("pin", "");
  const usernameValues = watch("usernames", []);
  const canAddMore =
    (usernameValues?.[usernameValues.length - 1]?.value ?? "").trim().length > 0;
  const entryStrength = useMemo(
    () => categorizePasscode(pinValue),
    [pinValue],
  );

  const handleSuggestStrongPasscode = useCallback((passcode) => {
    if (passcode) {
      // Auto-detect if passcode is alphanumeric
      if (/[a-zA-Z]/.test(passcode)) {
        setIsAlpha(true);
      }
      setValue("pin", passcode, { shouldValidate: true });
      setIsPasscodeSuggested(true);
      setTimeout(() => setIsPasscodeSuggested(false), 800);
    }
  }, [setValue]);

  const handleOnSubmit = async (data) => {
    if (!encKey) {
      if (toCreateMasterPass) {
        setShowCreateMasterModel(true);
      } else {
        setShowMasterPassModel(true);
      }
      return;
    }

    const { siteName, usernames, pin } = data;

    const filteredUsernames = usernames
      .map((u) => u.value.trim())
      .filter(Boolean);

    if (filteredUsernames.length === 0) {
      toast.error("Please provide at least one Username/ID.");
      return;
    }

    const strength = categorizePasscode(pin).category;

    const payload = {
      siteName: await encryptV3(siteName, encKey),
      userNames: await Promise.all(
        filteredUsernames.map((u) => encryptV3(u, encKey)),
      ),
      pin: await encryptV3(pin, encKey),
      strength: await encryptV3(strength, encKey),
    };

    await toast.promise(
      axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passcodes/create`,
        payload,
      ),
      {
        loading: "Saving Passcode...",
        success: (res) => {
          reset();
          fetchPasscodes();
          resetTimer();
          return res.data.message || "Passcode saved successfully!";
        },
        error: (err) => err.response?.data?.message || "Something went wrong.",
      },
    );
  };

  const PinField = (
    <>

      <InputField
        label="PIN / Passcode"
        icon={<KeyRound className="w-3.5 h-3.5" />}
        error={errors.pin?.message}
        action={
          <button
            type="button"
            onClick={() => handleCopy(pinValue, setIsPinCopied)}
            disabled={!pinValue || isPinCopied}
            className={`flex items-center gap-1 text-xs font-semibold transition-all duration-200 ${
              !pinValue
                ? "opacity-30 cursor-not-allowed text-gray-400"
                : isPinCopied
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400"
            }`}
          >
            {isPinCopied ? (
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
        <div className="space-y-1.5">
          <div className="relative">
            <input
              id="pin"
              {...register("pin", {
                required: "PIN is required.",
                validate: (value) => {
                  // Check actual value for alpha chars to avoid race condition
                  if (/[a-zA-Z]/.test(value)) return true;
                  return /^[0-9]+$/.test(value) || "PIN must be numeric.";
                },
              })}
              type={seePin ? "text" : "password"}
              inputMode={isAlpha ? "text" : "numeric"}
              autoComplete="new-password"
              placeholder={isAlpha ? "e.g., abc@123" : "e.g., 123456"}
              className={`${inputCls} pr-12 font-mono`}
            />
            <button
              type="button"
              onClick={() => setSeePin((currentValue) => !currentValue)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200"
              aria-label={seePin ? "Hide PIN" : "Show PIN"}
            >
              {seePin ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className={`cursor-default rounded-lg px-2.5 py-1 text-[11px] font-black tracking-wide transition-all bg-cyan-100 text-cyan-700 shadow-sm dark:bg-cyan-900/40 dark:text-cyan-300`}
            >
              123
            </button>
            <button
              type="button"
              onClick={() => setIsAlpha((prev) => !prev)}
              className={`cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-black tracking-wide transition-all ${
                isAlpha
                  ? "bg-purple-200 text-purple-700 shadow-sm dark:bg-purple-900/40 dark:text-purple-300"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-500"
              }`}
            >
              Aa
            </button>
          </div>
        </div>
      </InputField>

      <PinGeneratorControls
        isGenerated={isPasscodeSuggested}
        onPasscode={handleSuggestStrongPasscode}
      />
    </>
  );

  return (
    <ScrollReveal direction="up" delayMs={80} className="lg:col-span-8">
      <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden pb-4">
      <div className="px-6 md:px-8 pt-7 pb-6 border-b border-gray-100 dark:border-gray-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 shrink-0">
            <LockKeyhole className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white">
              New PINs & Passcodes
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              For services like DigiLocker, device PINs, etc.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        // className="space-y-6 p-4 md:p-8"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 px-4 md:px-8 gap-4">
          <div className="flex flex-col gap-4">
            <InputField
              label="Service Name"
              icon={<Sparkles className="w-3.5 h-3.5" />}
              error={errors.siteName?.message}
            >
              <input
                id="siteName"
                {...register("siteName", {
                  required: "Service name is required.",
                })}
                autoComplete="off"
                placeholder="e.g., DigiLocker, iPhone"
                className={inputCls}
              />
            </InputField>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
                <label className="flex items-center gap-1.5">
                  <UserPen className="w-3.5 h-3.5" />
                  Usernames / Associated IDs
                </label>
                {canAddMore && (
                  <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                )}
              </div>
              {fields.map((field, index) => {
                const usernameValue =
                  usernameValues?.[index]?.value ?? "";
                const isCopied = copiedUsernameIndex === index;

                return (
                  <div key={field.id} className="flex items-start gap-1">
                    <div className="relative flex-1">
                      <input
                        {...register(`usernames.${index}.value`)}
                        autoComplete="off"
                        placeholder={
                          index === 0 ? "Primary ID (e.g., Aadhar)" : "Another ID"
                        }
                        className={`${inputCls} pr-20`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(usernameValue, (copied) =>
                            setCopiedUsernameIndex(
                              copied ? index : null,
                            ),
                          )
                        }
                        disabled={!usernameValue || isCopied}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-semibold transition-all duration-200 ${
                          !usernameValue
                            ? "opacity-30 cursor-not-allowed text-gray-400"
                            : isCopied
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <CopyCheck className="w-3.5 h-3.5" />{" "}
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="shrink-0 h-12 px-2 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500"
                        aria-label="Remove username"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {fields.length <= 2 && PinField}
          </div>

          <div className="flex flex-col gap-4">
            {fields.length > 2 && PinField}

            {/* ── Strength Meter ── */}
            <div className="grid transition-all duration-300 grid-rows-[1fr] opacity-100">
              <div className="overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Always-visible header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Security Score
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                          entryStrength.score > 70
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50"
                            : entryStrength.score > 30
                              ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700/50"
                              : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50"
                        }`}
                      >
                        {pinValue ? entryStrength.category : "Awaiting Input..."}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStrengthMeterOpen((prev) => !prev)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                      aria-label={strengthMeterOpen ? "Close strength meter" : "Open strength meter"}
                    >
                      {strengthMeterOpen ? <X className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Collapsible body */}
                  <div className={`grid transition-all duration-300 ${strengthMeterOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-[width] duration-500 ease-out ${
                              entryStrength.score > 70
                                ? "bg-emerald-500"
                                : entryStrength.score > 30
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${pinValue && entryStrength.score === 0 ? "2" : entryStrength.score}%`,
                            }}
                          />
                        </div>

                        {/* Warnings */}
                        {entryStrength.score > 0 && entryStrength.score <= 30 && (
                          <div className="flex items-start gap-2 p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/50 animate-fade-in">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-medium text-red-600 dark:text-red-400 leading-snug">
                              This passcode is weak and easily guessable. Use a longer combination with mixed characters.
                            </p>
                          </div>
                        )}

                        {/* Suggestions */}
                        {entryStrength.score > 0 && entryStrength.score <= 70 && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                              Suggestions
                            </p>
                            <div className="space-y-1 pr-1">
                              {pinValue.length < 6 && /^[0-9]+$/.test(pinValue) && (
                                <div className="flex items-start gap-2 animate-fade-in">
                                  <span className="w-1 h-1 bg-cyan-400 rounded-full shrink-0 mt-1.5" />
                                  <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-snug">
                                    Consider 6+ digits for better security
                                  </p>
                                </div>
                              )}
                              {pinValue.length >= 6 && pinValue.length < 8 && !/[a-zA-Z]/.test(pinValue) && (
                                <div className="flex items-start gap-2 animate-fade-in">
                                  <span className="w-1 h-1 bg-cyan-400 rounded-full shrink-0 mt-1.5" />
                                  <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-snug">
                                    Add letters/symbols for alphanumeric strength
                                  </p>
                                </div>
                              )}
                              {!/[a-zA-Z]/.test(pinValue) && pinValue.length >= 4 && pinValue.length <= 6 && (
                                <div className="flex items-start gap-2 animate-fade-in">
                                  <span className="w-1 h-1 bg-cyan-400 rounded-full shrink-0 mt-1.5" />
                                  <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-snug">
                                    Add letters to make it alphanumeric
                                  </p>
                                </div>
                              )}
                              {entryStrength.category === "weak" && entryStrength.score > 0 && (
                                <div className="flex items-start gap-2 animate-fade-in">
                                  <span className="w-1 h-1 bg-cyan-400 rounded-full shrink-0 mt-1.5" />
                                  <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-snug">
                                    Avoid common patterns, sequences, or repeated digits
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
        </div>

        <div className="px-4 md:px-8 pt-4">
          {/* Save Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-base transition-all duration-300 ${
              isSubmitting
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-cyan-600 via-sky-600 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:scale-95"
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
    </div>
  </ScrollReveal>
);
}
