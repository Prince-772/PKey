"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LockKeyhole,
  Shield,
  ShieldCheck,
  TriangleAlert,
  UserPen,
  AlertCircle,
  Zap,
  Database,
  Fingerprint,
  RefreshCcw,
  Cpu,
  RefreshCw,
  Terminal,
  Activity,
  Lock,
  Gauge,
  BookOpen,
  Info,
  ArrowRight,
  GitMerge,
  Layers,
  Copy,
  CopyCheck,
} from "lucide-react";
import Link from "next/link";

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

// function capitalize(str) {
//   if (!str) return "";
//   return str[0].toUpperCase() + str.slice(1);
// }

const CreatePassword = () => {
  const [seePassword, setseePassword] = useState(false);
  const [isPassSuggested, setIsPassSuggested] = useState(false);
  const [isPassCopied, setIsPassCopied] = useState(false);
  const [isUserNameCopied, setIsUserNameCopied] = useState(false);
  const { encKey, resetTimer, masterPassSet, setMasterPassSet, masterPass } =
    useMasterPass();
  const [showMasterPassModel, setshowMasterPassModel] = useState(false);
  const [showCreateMasterModel, setShowCreateMasterModel] = useState(false);
  const { data: session, update } = useSession();

  // Logic for Random Info Cards
  const allInfoCards = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
      text: "Zero-Knowledge Architecture",
    },
    {
      icon: <Cpu className="w-5 h-5 text-orange-500" />,
      text: "Argon2id Memory-Hard Derivation",
    },
    {
      icon: <Lock className="w-5 h-5 text-red-500" />,
      text: "AES-256-GCM Authenticated Encryption",
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      text: "WASM Accelerated Cryptography",
    },
    {
      icon: <GitMerge className="w-5 h-5 text-purple-500" />,
      text: "HKDF Key Splitting Protocol",
    },
    {
      icon: <Activity className="w-5 h-5 text-rose-500" />,
      text: "Non-Blocking Background Workers",
    },
    {
      icon: <Terminal className="w-5 h-5 text-slate-500" />,
      text: "Native Web Crypto API Engine",
    },
    {
      icon: <Database className="w-5 h-5 text-emerald-500" />,
      text: "Encrypted Cloud Backup",
    },
    {
      icon: <Fingerprint className="w-5 h-5 text-indigo-500" />,
      text: "Hardware-Backed Secure Salting",
    },
    {
      icon: <KeyRound className="w-5 h-5 text-cyan-500" />,
      text: "In-Built Strong Password Generator",
    },
    {
      icon: <Gauge className="w-5 h-5 text-green-500" />,
      text: "Real-time Entropy Analysis",
    },
    {
      icon: <Layers className="w-5 h-5 text-sky-500" />,
      text: "Client-Side Data Masking",
    },
  ];

  const [randomCards, setRandomCards] = useState([]);
  useEffect(() => {
    const zeroKnowledgeCard = allInfoCards[0];
    const otherCards = allInfoCards.slice(1);
    const shuffled = [...otherCards].sort(() => 0.5 - Math.random());
    const randomTwo = shuffled.slice(0, 2);
    const picked = [zeroKnowledgeCard, ...randomTwo].filter(Boolean);
    setRandomCards(picked);
  }, []);

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
      masterPassSet
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
            return (
              <span>
                Your account is blocked due to too many invalid attempts.{" "}
                <Link
                  href="/blocked-accounts-help"
                  className="underline text-blue-500"
                >
                  Learn what to do
                </Link>
              </span>
            );
          } else {
            return message || "Something went wrong";
          }
        },
      },
    );
    reset(); // Clear ALL fields: site, username, password
  };

  const onCreateMasterPass = useCallback(
    async (masterPass) => {
      setMasterPassSet(false);
      setShowCreateMasterModel(false);
      const { authHash, salt } = await generateAuthData(masterPass);
      await toast.promise(CreateMasterPass(authHash, salt), {
        loading: "Processing Securily...",
        success: async (res) => {
          if (session) {
            await update({
              ...session,
              user: {
                ...session.user,
                salt,
              },
            });
          }
          return res.message || "Master Password created!";
        },
        error: ({ message }) => {
          setMasterPassSet(true);
          if (message === "BLOCKED_ACCOUNT") {
            return (
              <span>
                Your account is blocked due to too many invalid attempts.{" "}
                <Link
                  href="/blocked-accounts-help"
                  className="underline text-blue-500"
                >
                  Learn what to do
                </Link>
              </span>
            );
          } else {
            return message || "Unable to create master password";
          }
        },
      });
    },
    [session, update],
  );

  // useEffect(() => {
  //   if (masterPassSet && !encKey) setShowCreateMasterModel(true);
  //   return () => setshowMasterPassModel(false);
  // }, [masterPassSet, masterPass, encKey]);

  return (
    <div className="flex flex-col items-center pt-6 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {showMasterPassModel && (
        <MasterPasswordModel
          isOpen={showMasterPassModel}
          onClose={() => setshowMasterPassModel(false)}
        />
      )}
      {showCreateMasterModel && (
        <CreateMasterPasswordModal
          isOpen={showCreateMasterModel}
          onClose={() => setShowCreateMasterModel(false)}
          onSetMasterPassword={onCreateMasterPass}
        />
      )}

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <h2 className="text-2xl font-black mb-1">
              Hey,{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {session?.user?.name?.split(" ")[0] || "User"}
              </span>
            </h2>
            <p className="text-sm text-gray-800 dark:text-gray-400 leading-relaxed font-inter">
              {encKey
                ? "Vault is unlocked. Ready to secure a new account."
                : !masterPassSet
                  ? "Vault is locked. Enter your Master Password to proceed."
                  : "No Master Password found. Setup your vault to start saving entries."}{" "}
            </p>

            <div className="mt-6 space-y-3">
              {randomCards.length > 0 ? (
                randomCards.map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                  >
                    {card.icon}
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {card.text}
                    </span>
                  </div>
                ))
              ) : (
                <div className="h-35 w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
              )}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-6 lg:gap-3 items-center justify-center sm:justify-start lg:justify-center mt-6 text-xs sm:test-sm">
                <Link
                  href="/security"
                  className="group relative inline-flex items-center justify-center gap-2 p-2 pl-4 hover:pl-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <Info className="w-4 h-4 shrink-0 relative z-10 transition-transform duration-300 group-hover:-rotate-12" />
                  <span className="relative z-10">Learn More</span>
                  <ArrowRight className="w-4 h-4 shrink-0 relative z-10 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </Link>

                <Link
                  href="/password-strength"
                  className="group relative inline-flex items-center justify-center gap-2 p-2 pl-4 hover:pl-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <BookOpen className="w-4 h-4 shrink-0 relative z-10 transition-transform duration-300 group-hover:-rotate-12" />
                  <span className="relative z-10">Password Guide</span>
                  <ArrowRight className="w-4 h-4 shrink-0 relative z-10 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </Link>
              </div>
              {masterPassSet && (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateMasterModel(true)}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full shadow-lg
             bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-lg
             hover:from-blue-700 hover:to-purple-700
             transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-attention"
                  >
                    Set Master Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 mb-6">
          <div className="rounded-lg shadow-xl px-6 py-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <h1 className="text-lg md:text-xl font-extrabold mb-8 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Create New Password Entry
            </h1>

            <form
              onSubmit={handleSubmit(handleOnSubmit)}
              className="flex flex-col gap-6"
               autoComplete="off"
            >
              {/* To Avoid Browsers from asking to save passwrod */}
              <input type="text" name="fakeuser" autoComplete="username" style={{ display: "none" }} />
              <input type="password" name="fakepass" autoComplete="new-password" style={{ display: "none" }} />


              <div className="group">
                <label className="px-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 flex items-center gap-1 mb-1">
                  <Globe className="w-4 h-4 shrink-0" /> Site Name
                </label>
                <input
                  {...register("site", { required: "Site name is required" })}
                  className="w-full h-12 px-4 border-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 transition-all duration-300 text-lg"
                  autoComplete="off"
                />
                {errors.site && (
                  <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
                    <TriangleAlert className="w-4 h-4" />
                    {errors.site.message}
                  </p>
                )}
              </div>

              {/* Username Input */}
              <div className="group">
                <div className="relative px-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 flex items-center gap-1 mb-1">
                  <UserPen className="w-4 h-4 shrink-0" /> Username
                  <button
                    type="button"
                    onClick={() => handleCopy(usernameValue, setIsUserNameCopied)}
                    disabled={!usernameValue || isUserNameCopied}
                    className={`absolute right-2 inline-flex bg-linear-to-r items-center gap-2 transition-all duration-300 active:scale-95 rounded-md font-semibold text-sm
                    ${
                      !usernameValue
                        ? "cursor-not-allowed"
                        : isUserNameCopied
                          ? "text-emerald-600 dark:text-green-400 scale-95 cursor-progress"
                          : "" // Normal State
                    }`}
                  >
                    {isUserNameCopied ? (
                      <>
                        <CopyCheck className="w-4 h-4 animate-bounce" />
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className="w-full h-12 px-4 border-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 transition-all duration-300 text-lg"
                  autoComplete="off"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
                    <TriangleAlert className="w-4 h-4" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="group">
                <div className="relative px-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 flex items-center gap-1 mb-1">
                  <KeyRound className="w-4 h-4" /> Password
                  <button
                    type="button"
                    onClick={() => handleCopy(passwordValue, setIsPassCopied)}
                    disabled={!passwordValue || isPassCopied}
                    className={`absolute right-2 inline-flex bg-linear-to-r items-center gap-2 transition-all duration-300 active:scale-95 rounded-md font-semibold text-sm
                    ${
                      !passwordValue
                        ? "cursor-not-allowed"
                        : isPassCopied
                          ? "text-emerald-600 dark:text-green-400 scale-95 cursor-progress"
                          : "" // Normal State
                    }`}
                  >
                    {isPassCopied ? (
                      <>
                        <CopyCheck className="w-4 h-4 animate-bounce" />
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type={seePassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full h-12 pl-4 pr-12 border-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 transition-all text-lg duration-300 font-mono"
                  />
                  <div
                    onClick={() => setseePassword(!seePassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-blue-500 transition-colors duration-300"
                  >
                    {seePassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1 md:flex">
                      <TriangleAlert className="w-4 h-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center my-3">
                  <button
                    type="button"
                    onClick={HandleSuggestStrongPassword}
                    disabled={isPassSuggested}
                    className={`inline-flex bg-linear-to-r items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 text-sm
                    ${
                      isPassSuggested
                        ? "from-green-600 to-emerald-600 text-white shadow-emerald-500/40 scale-95 cursor-progress"
                        : "from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 active:scale-95" // Normal State
                    }`}
                  >
                    {isPassSuggested ? (
                      <>
                        <ShieldCheck className="w-5 h-5 animate-bounce shrink-0" />
                        <span>Password Suggested!</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 shrink-0" />
                        <span>Suggest Strong Password</span>
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence mode="popLayout">
                  {passwordValue && (
                    <motion.div
                      key="strength-meter-main"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className=""
                    >
                      <motion.div
                        layout
                        className="font-inter p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3 overflow-auto scroll-bar-hide mt-3 max-h-60"
                      >
                        {/* Header Section */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] md:text-[12px] uppercase font-bold text-gray-800 dark:text-gray-200">
                            Security Score
                          </span>
                          <motion.span
                            layout
                            key={entryStrength.category}
                            className={`text-[10px] md:text-[12px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${
                              entryStrength.score > 70
                                ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100"
                                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                            }`}
                          >
                            {entryStrength.category}
                          </motion.span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            layout
                            className={`h-1.5 rounded-full ${
                              entryStrength.score > 75
                                ? "bg-emerald-500"
                                : entryStrength.score > 40
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                            }`}
                            animate={{ width: `${entryStrength.score}%` }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        </div>

                        {/* Feedback Section */}
                        <div className="flex flex-col gap-2">
                          <AnimatePresence mode="popLayout">
                            {entryStrength.result?.feedback?.warning && (
                              <motion.div
                                layout
                                key={`warning-${entryStrength.result.feedback.warning}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-900/30"
                              >
                                <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5" />
                                <p className="text-[10px] md:text-[12px] font-medium text-red-600 dark:text-red-400">
                                  {entryStrength.result.feedback.warning}
                                </p>
                              </motion.div>
                            )}

                            {entryStrength.result?.feedback?.suggestions
                              ?.length > 0 && (
                              <motion.div
                                layout
                                key="suggestions-container"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-1"
                              >
                                <p className="text-[10px] md:text-[12px] font-bold text-gray-400 uppercase ml-1">
                                  Suggestions
                                </p>
                                <div className="max-h-24 overflow-y-auto pr-1">
                                  {entryStrength.result.feedback.suggestions
                                    .filter(
                                      (item, index, self) =>
                                        self.indexOf(item) === index,
                                    )
                                    .map((suggestion, i) => (
                                      <motion.div
                                        layout
                                        key={`msg-${suggestion.replace(/\s+/g, "-")}-${i}`}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 5 }}
                                        className="flex items-start gap-2 mb-1"
                                      >
                                        <span className="w-1 h-1 bg-blue-400 rounded-full shrink-0 mt-1.5" />
                                        <p className="text-[10px] md:text-[12px] text-gray-600 dark:text-gray-400 italic leading-tight">
                                          {suggestion}
                                        </p>
                                      </motion.div>
                                    ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Dual Crack-Time Display */}
                        {entryStrength.result?.crack_times_display && (
                          <motion.div
                            layout
                            key="crack-time-display"
                            className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2"
                          >
                            <p className="text-[10px] md:text-[12px] font-bold text-gray-800 dark:text-gray-100 uppercase flex items-center gap-1">
                              <Cpu className="w-3 h-3" /> Estimated Time to
                              Crack
                            </p>

                            <div className="space-y-1">
                              {/* Scenario 1: Standard Hacker (Bitwarden Style) */}
                              <div className="flex items-baseline gap-2">
                                <span
                                  className={`text-[12px] md:text-sm font-semibold ${entryStrength.score > 70 ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                                >
                                  {capitalize(
                                    entryStrength.result.crack_times_display
                                      .offline_slow_hashing_1e4_per_second,
                                  )}
                                </span>
                                <span className="text-[10px] md:text-[12px] text-gray-700 dark:text-gray-200 italic">
                                  (standard hacker attack, 10k guesses/sec)
                                </span>
                              </div>

                              {/* Scenario 2: Supercomputer (Hardcore Reality) */}
                              <div className="flex items-baseline gap-2">
                                <span className="text-[12px] md:text-sm font-semibold text-blue-700 dark:text-blue-400">
                                  {capitalize(
                                    entryStrength.result.crack_times_display
                                      .offline_fast_hashing_1e10_per_second,
                                  )}
                                </span>
                                <span className="text-[10px] md:text-[12px] text-gray-700 dark:text-gray-200 italic">
                                  (by a supercomputer, 10B guesses/sec)
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button - Your Original Custom Theme */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center gap-3 px-6 md:px-10 py-3.5 rounded-full shadow-xl font-bold text-lg transition-all duration-300
      ${
        isSubmitting
          ? "opacity-60 cursor-not-allowed bg-gray-400"
          : "bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95"
      }`}
                >
                  <LockKeyhole
                    className={`w-5 h-5 ${isSubmitting ? "animate-pulse" : ""} shrink-0`}
                  />
                  <span>
                    {isSubmitting ? "Encrypting..." : "Save to Vault"}
                  </span>
                  {!isSubmitting && (
                    <ShieldCheck className="w-5 h-5 text-white/80 shrink-0" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
