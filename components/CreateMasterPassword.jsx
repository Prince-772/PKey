import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  KeyRound,
  CheckCircle2,
  LoaderCircle,
  AlertCircle,
  Cpu,
} from "lucide-react";
import { capitalize, getPasswordStrength } from "@/lib/helper";

export default function CreateMasterPasswordModal({
  isOpen,
  onClose,
  onSetMasterPassword,
}) {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const masterPasswordValue = watch("masterPassword", "");
  const strength = useMemo(
    () => getPasswordStrength(masterPasswordValue),
    [masterPasswordValue],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSetMasterPassword(data.masterPassword);
    reset();
    onClose();
  };

  const getBarColor = (score) => {
    if (score < 25) return "bg-red-500";
    if (score < 50) return "bg-orange-500";
    if (score < 75) return "bg-yellow-500";
    return score < 90 ? "bg-blue-500" : "bg-emerald-500";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-gray-950/70 dark:bg-black/80 backdrop-blur-md overflow-auto scroll-bar-hide ">
      <div className="relative bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-2xl w-[95%] max-w-md max-h-[95vh] animate-scale-in border-3 border-gray-200 dark:border-gray-700 overflow-auto scroll-bar-hide my-auto">
        <X
          onClick={onClose}
          className="fixed top-4 right-4 w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
        />

        <div className="text-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <KeyRound className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-3 mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Set Your Master Password
          </h2>
          <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex gap-3 items-start transition-all duration-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />

                <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-tight">
                  Recovery Notice
                </p>
              </div>
              <hr className="text-amber-300 my-2" />
              <p className="text-[12px] md:text-sm leading-relaxed text-amber-700 dark:text-amber-300/80">
                This password unlocks your credentials. If forgotten, your vault
                <span className="font-bold underline ml-1">
                  cannot be recovered
                </span>
                . You will have to reset and lose existing data.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="w-full">
            <input
              type="password"
              placeholder="Master Password"
              {...register("masterPassword", {
                required: "Master password is required",
                minLength: { value: 8, message: "At least 8 characters" },
              })}
              className="px-4 py-3 rounded-lg border-2 bg-gray-50 w-full dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 outline-none text-lg"
            />
            {errors.masterPassword && (
              <p className="text-red-600 text-sm ml-1 font-roboto">
                {errors.masterPassword.message}
              </p>
            )}

            <div
              className={`grid transition-all duration-300 ${masterPasswordValue ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="mt-3 space-y-3 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm overflow-auto scroll-bar-hide max-h-60">
                  {/* Progress Bar & Header */}
                  <div className="flex items-center justify-between mb-1 font-inter">
                    <span className="text-[10px] md:text-[12px] uppercase font-bold text-gray-700 dark:text-gray-300 tracking-wider">
                      Master Password Strength
                    </span>
                    <span
                      className={`text-[10px] md:text-[12px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${
                        strength.score > 70
                          ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {strength.category}
                    </span>
                  </div>

                  <div className="w-full mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className={`h-2 rounded-full transition-[width] duration-500 ease-out shadow-md ${getBarColor(strength.score)}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>

                  {/* Dynamic Feedback Section */}
                  <div className="flex flex-col gap-2">
                    {strength.result?.feedback.warning && (
                      <div className="flex items-start gap-2 p-2 bg-red-50/80 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 animate-fade-in">
                        <AlertCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] md:text-[12px] font-medium text-red-600 dark:text-red-400 leading-tight">
                          {strength.result.feedback.warning}
                        </p>
                      </div>
                    )}

                    {strength.result?.feedback.suggestions?.length > 0 && (
                      <div className="pt-1 animate-fade-in">
                        <p className="text-[10px] md:text-[12px] font-bold text-gray-400 uppercase mb-1 ml-1">
                          Suggestions:
                        </p>
                        <div className="max-h-24 overflow-y-auto space-y-1 pr-1 scroll-bar-hide">
                          {strength.result.feedback.suggestions.map(
                            (suggestion, i) => (
                              <div
                                key={`suggestion-${i}-${suggestion.substring(0, 5)}`}
                                className="text-[10px] md:text-[12px] text-gray-600 dark:text-gray-400 leading-tight flex items-start gap-2"
                              >
                                <span className="w-1 h-1 bg-blue-400 rounded-full shrink-0 mt-1.5" />
                                <span className="italic">{suggestion}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {strength.result?.crack_times_display && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-[10px] md:text-[12px] font-bold text-gray-700 dark:text-gray-200 uppercase flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> Estimated Time to Crack
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-[10px] md:text-[12px] md:text-sm font-semibold ${strength.score > 70 ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {capitalize(
                            strength.result.crack_times_display
                              .offline_slow_hashing_1e4_per_second,
                          )}
                        </span>
                        <span className="text-[10px] md:text-[12px] text-gray-700 dark:text-gray-200 italic">
                          (standard hacker attack, 10k guesses/sec)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (val) =>
                  val === masterPasswordValue || "Passwords do not match",
              })}
              className="w-full px-4 py-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 outline-none text-lg"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 font-roboto ml-1 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || strength.score < 50}
            className="mt-4 px-6 py-3 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 flex gap-2 justify-center items-center transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />{" "}
                Setting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" /> Set Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
