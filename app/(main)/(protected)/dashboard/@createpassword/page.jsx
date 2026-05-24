"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
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
  LockOpen,
  Sparkles,
  X,
  ChevronDown,
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
import ScrollReveal from "@/components/ScrollReveal";

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
const inputCls = "w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all duration-200 text-base placeholder:text-gray-300 dark:placeholder:text-gray-600";

const CreatePassword = () => {
  const [seePassword, setseePassword] = useState(false);
  const [isPassSuggested, setIsPassSuggested] = useState(false);
  const [isPassCopied, setIsPassCopied] = useState(false);
  const [isUserNameCopied, setIsUserNameCopied] = useState(false);
  const [strengthMeterOpen, setStrengthMeterOpen] = useState(true);
  const { encKey, resetTimer, masterPassSet, setMasterPassSet, masterPass } =
    useMasterPass();
  const [showMasterPassModel, setshowMasterPassModel] = useState(false);
  const [showCreateMasterModel, setShowCreateMasterModel] = useState(false);
  const { data: session, update } = useSession();

  // Info cards pool
  const allInfoCards = [
    { icon: <ShieldCheck className="w-4 h-4" />, text: "Zero-Knowledge Architecture",        color: "blue"   },
    { icon: <Cpu className="w-4 h-4" />,         text: "Argon2id Memory-Hard Derivation",    color: "orange" },
    { icon: <Lock className="w-4 h-4" />,         text: "AES-256-GCM Authenticated Encryption", color: "red" },
    { icon: <Zap className="w-4 h-4" />,          text: "WASM Accelerated Cryptography",      color: "yellow" },
    { icon: <GitMerge className="w-4 h-4" />,     text: "HKDF Key Splitting Protocol",        color: "purple" },
    { icon: <Activity className="w-4 h-4" />,     text: "Non-Blocking Background Workers",    color: "rose"   },
    { icon: <Terminal className="w-4 h-4" />,     text: "Native Web Crypto API Engine",        color: "slate"  },
    { icon: <Database className="w-4 h-4" />,     text: "Encrypted Cloud Backup",             color: "emerald"},
    { icon: <Fingerprint className="w-4 h-4" />,  text: "Hardware-Backed Secure Salting",     color: "indigo" },
    { icon: <KeyRound className="w-4 h-4" />,     text: "In-Built Strong Password Generator", color: "cyan"   },
    { icon: <Gauge className="w-4 h-4" />,        text: "Real-time Entropy Analysis",         color: "green"  },
    { icon: <Layers className="w-4 h-4" />,       text: "Client-Side Data Masking",           color: "sky"    },
  ];

  const cardAccent = {
    blue:    "text-blue-500   bg-blue-50   dark:bg-blue-500/10   border-blue-100   dark:border-blue-500/20",
    orange:  "text-orange-500 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20",
    red:     "text-red-500    bg-red-50    dark:bg-red-500/10    border-red-100    dark:border-red-500/20",
    yellow:  "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-100 dark:border-yellow-500/20",
    purple:  "text-purple-500 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20",
    rose:    "text-rose-500   bg-rose-50   dark:bg-rose-500/10   border-rose-100   dark:border-rose-500/20",
    slate:   "text-slate-500  bg-slate-50  dark:bg-slate-500/10  border-slate-100  dark:border-slate-500/20",
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
    indigo:  "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20",
    cyan:    "text-cyan-500   bg-cyan-50   dark:bg-cyan-500/10   border-cyan-100   dark:border-cyan-500/20",
    green:   "text-green-500  bg-green-50  dark:bg-green-500/10  border-green-100  dark:border-green-500/20",
    sky:     "text-sky-500    bg-sky-50    dark:bg-sky-500/10    border-sky-100    dark:border-sky-500/20",
  };

  const [randomCards, setRandomCards] = useState([]);
  useEffect(() => {
    const zero = allInfoCards[0];
    const rest = allInfoCards.slice(1);
    const shuffled = [...rest].sort(() => 0.5 - Math.random());
    setRandomCards([zero, ...shuffled.slice(0, 2)]);
  }, []);

  const { register, formState: { errors, isSubmitting }, handleSubmit, setValue, reset, watch } = useForm();

  const passwordValue  = watch("password", "");
  const usernameValue  = watch("username", "");
  const entryStrength  = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

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
      masterPassSet ? setShowCreateMasterModel(true) : setshowMasterPassModel(true);
      return;
    }
    const strength = categorizePassword(formData.password);
    await toast.promise(
      handleSavePassword({
        site:     await encryptV3(formData.site, encKey),
        username: await encryptV3(formData.username, encKey),
        password: await encryptV3(formData.password, encKey),
        strength: await encryptV3(strength, encKey),
      }),
      {
        loading: "Saving...",
        success: ({ message }) => { resetTimer(); return message || "Saved Successfully!"; },
        error: ({ message }) => {
          if (message === "BLOCKED_ACCOUNT") {
            return (
              <span>
                Your account is blocked.{" "}
                <Link href="/blocked-accounts-help" className="underline text-blue-500">Learn what to do</Link>
              </span>
            );
          }
          return message || "Something went wrong";
        },
      },
    );
    reset();
  };

  const onCreateMasterPass = useCallback(
    async (masterPass) => {
      setMasterPassSet(false);
      setShowCreateMasterModel(false);
      const { authHash, salt } = await generateAuthData(masterPass);
      await toast.promise(CreateMasterPass(authHash, salt), {
        loading: "Processing Securely...",
        success: async (res) => {
          if (session) await update({ ...session, user: { ...session.user, salt } });
          return res.message || "Master Password created!";
        },
        error: ({ message }) => {
          setMasterPassSet(true);
          if (message === "BLOCKED_ACCOUNT") {
            return (
              <span>
                Your account is blocked.{" "}
                <Link href="/blocked-accounts-help" className="underline text-blue-500">Learn what to do</Link>
              </span>
            );
          }
          return message || "Unable to create master password";
        },
      });
    },
    [session, update],
  );

  // Vault status derived values
  const vaultStatus = encKey
    ? { label: "Vault Unlocked", icon: <LockOpen className="w-3.5 h-3.5" />, cls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50" }
    : !masterPassSet
      ? { label: "Vault Locked", icon: <Lock className="w-3.5 h-3.5" />, cls: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50" }
      : { label: "Setup Required", icon: <AlertCircle className="w-3.5 h-3.5" />, cls: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50" };

  const vaultSubtext = encKey
    ? "Ready to secure a new account."
    : !masterPassSet
      ? "Enter your Master Password to proceed."
      : "Setup your vault to start saving entries.";

  return (
    <div className="flex flex-col items-center pt-6 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300 min-h-screen">
      {showMasterPassModel && (
        <MasterPasswordModel isOpen={showMasterPassModel} onClose={() => setshowMasterPassModel(false)} />
      )}
      {showCreateMasterModel && (
        <CreateMasterPasswordModal
          isOpen={showCreateMasterModel}
          onClose={() => setShowCreateMasterModel(false)}
          onSetMasterPassword={onCreateMasterPass}
        />
      )}

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-10">

        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
        <ScrollReveal direction="up" delayMs={0} className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">

            {/* Gradient header strip */}
            <div className="relative bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80 text-xs font-black uppercase tracking-widest">PKey Vault</span>
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">
                  Hey, {session?.user?.name?.split(" ")[0] || "User"} 👋
                </h2>
                <p className="text-white/70 text-sm font-medium mt-1">{vaultSubtext}</p>
              </div>
            </div>

            {/* Vault status chip */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black ${vaultStatus.cls}`}>
                {vaultStatus.icon}
                {vaultStatus.label}
              </div>
            </div>

            {/* Info cards */}
            <div className="px-6 py-4 space-y-2.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Security Stack</p>
              {randomCards.length > 0 ? (
                randomCards.map((card, i) => (
                  <ScrollReveal key={i} direction="right" delayMs={i * 100}>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-xl border ${cardAccent[card.color]} transition-all duration-200`}
                    >
                      <div className={`shrink-0 ${cardAccent[card.color]}`}>{card.icon}</div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">{card.text}</span>
                    </div>
                  </ScrollReveal>
                ))
              ) : (
                <div className="space-y-2.5">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-11 w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" />
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="px-6 pb-5 space-y-2.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Learn More</p>
              <ScrollReveal direction="right" delayMs={0}>
                <Link
                  href="/security"
                  className="group flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">Security Architecture</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              </ScrollReveal>
              <ScrollReveal direction="right" delayMs={100}>
                <Link
                  href="/password-strength"
                  className="group flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">Password Strength Guide</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              </ScrollReveal>
            </div>

            {/* Set Master Password CTA — shown when masterPassSet is true */}
            {masterPassSet && (
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => setShowCreateMasterModel(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 animate-attention"
                >
                  <KeyRound className="w-4 h-4" />
                  Set Master Password
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ── RIGHT FORM ───────────────────────────────────────────────── */}
        <ScrollReveal direction="up" delayMs={80} className="lg:col-span-8 mb-6">
          <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">

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

            <form
              onSubmit={handleSubmit(handleOnSubmit)}
              className="px-6 md:px-8 py-7 flex flex-col gap-6"
              autoComplete="off"
            >
              {/* Browser autofill traps */}
              <input type="text"     name="fakeuser" autoComplete="username"     style={{ display: "none" }} />
              <input type="password" name="fakepass" autoComplete="new-password" style={{ display: "none" }} />

              {/* Site Name */}
              <InputField
                label="Site Name"
                icon={<Globe className="w-3.5 h-3.5" />}
                error={errors.site?.message}
              >
                <input
                  {...register("site", { required: "Site name is required" })}
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
                    onClick={() => handleCopy(usernameValue, setIsUserNameCopied)}
                    disabled={!usernameValue || isUserNameCopied}
                    className={`flex items-center gap-1 text-xs font-semibold transition-all duration-200 ${
                      !usernameValue ? "opacity-30 cursor-not-allowed text-gray-400"
                      : isUserNameCopied ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                    }`}
                  >
                    {isUserNameCopied
                      ? <><CopyCheck className="w-3.5 h-3.5" /> Copied!</>
                      : <><Copy className="w-3.5 h-3.5" /> Copy</>
                    }
                  </button>
                }
              >
                <input
                  {...register("username", { required: "Username is required" })}
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
                    onClick={() => handleCopy(passwordValue, setIsPassCopied)}
                    disabled={!passwordValue || isPassCopied}
                    className={`flex items-center gap-1 text-xs font-semibold transition-all duration-200 ${
                      !passwordValue ? "opacity-30 cursor-not-allowed text-gray-400"
                      : isPassCopied ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                    }`}
                  >
                    {isPassCopied
                      ? <><CopyCheck className="w-3.5 h-3.5" /> Copied!</>
                      : <><Copy className="w-3.5 h-3.5" /> Copy</>
                    }
                  </button>
                }
              >
                <div className="relative">
                  <input
                    {...register("password", { required: "Password is required" })}
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
                    {seePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

              {/* Strength Meter — collapsible, CSS grid trick */}
              <div className={`grid transition-all duration-300 ${passwordValue ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">

                    {/* Always-visible header row — Score + toggle button */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Security Score</span>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                          entryStrength.score > 70
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50"
                            : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50"
                        }`}>
                          {entryStrength.category}
                        </span>
                      </div>
                      {/* Toggle button — X to close, ChevronDown to open */}
                      <button
                        type="button"
                        onClick={() => setStrengthMeterOpen(prev => !prev)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                        aria-label={strengthMeterOpen ? "Close strength meter" : "Open strength meter"}
                      >
                        {strengthMeterOpen
                          ? <X className="w-3.5 h-3.5" />
                          : <ChevronDown className="w-3.5 h-3.5" />
                        }
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
                                entryStrength.score > 75 ? "bg-emerald-500"
                                : entryStrength.score > 40 ? "bg-orange-500"
                                : "bg-red-500"
                              }`}
                              style={{ width: `${entryStrength.score}%` }}
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
                          {entryStrength.result?.feedback?.suggestions?.length > 0 && (
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Suggestions</p>
                              <div className="max-h-20 overflow-y-auto space-y-1 pr-1 scroll-bar-hide">
                                {entryStrength.result.feedback.suggestions
                                  .filter((item, i, self) => self.indexOf(item) === i)
                                  .map((suggestion, i) => (
                                    <div key={i} className="flex items-start gap-2 animate-fade-in">
                                      <span className="w-1 h-1 bg-blue-400 rounded-full shrink-0 mt-1.5" />
                                      <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-snug">{suggestion}</p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Crack time */}
                          {entryStrength.result?.crack_times_display && (
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                              <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Cpu className="w-3 h-3" /> Estimated Time to Crack
                              </p>
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                                  <span className="text-[10px] text-gray-500 italic">Standard attack (10k/sec)</span>
                                  <span className={`text-xs font-black ${entryStrength.score > 70 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                                    {capitalize(entryStrength.result.crack_times_display.offline_slow_hashing_1e4_per_second)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                                  <span className="text-[10px] text-gray-500 italic">Supercomputer (10B/sec)</span>
                                  <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                                    {capitalize(entryStrength.result.crack_times_display.offline_fast_hashing_1e10_per_second)}
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
                <LockKeyhole className={`w-5 h-5 shrink-0 ${isSubmitting ? "animate-pulse" : ""}`} />
                <span>{isSubmitting ? "Encrypting & Saving..." : "Save to Vault"}</span>
                {!isSubmitting && <ShieldCheck className="w-4 h-4 text-white/70 shrink-0" />}
              </button>

              {/* Encryption assurance note */}
              {!isSubmitting && (
                <p className="text-center text-[11px] text-gray-400 dark:text-gray-600 font-medium -mt-2">
                  🔒 Encrypted on your device before leaving
                </p>
              )}

            </form>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default CreatePassword;