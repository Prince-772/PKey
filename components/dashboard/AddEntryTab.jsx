import React, { useState } from "react";
import {
  Globe,
  StickyNote,
  CreditCard,
  User,
  ArrowLeft,
  ChevronRight,
  Fingerprint,
  Lock,
  ShieldCheck,
  Hash,
} from "lucide-react";
import LoginForm from "@/components/dashboard/forms/LoginForm";
import PinForm from "@/components/dashboard/forms/PinForm.jsx";
// import PaymentCardForm from "@/components/dashboard/forms/PaymentCardForm.jsx";
import ComingSoonForm from "@/components/dashboard/forms/ComingSoonForm";
import ScrollReveal from "@/components/ScrollReveal";

export default function AddEntryTab({ expanded }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // List of categories
  const categories = [
    {
      id: "login",
      title: "Login Credentials",
      description: "Websites, apps, and online service accounts.",
      icon: <Globe className="w-5 h-5 md:w-6 md:h-6" />,
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400",
      hoverBorder: "hover:border-blue-500/50 dark:hover:border-blue-500/50",
      accentBar: "bg-blue-500",
      hoverGlow: "group-hover:shadow-blue-500/10",
      badge: "AES-256",
      badgeCls:
        "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      id: "passcode",
      title: "PINs & Passcodes",
      description: "Device PINs, mPINs, and short numeric codes.",
      icon: <Hash className="w-5 h-5 md:w-6 md:h-6" />,
      color: "cyan",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/30",
      textColor: "text-cyan-600 dark:text-cyan-400",
      hoverBorder: "hover:border-cyan-500/50 dark:hover:border-cyan-500/50",
      accentBar: "bg-cyan-500",
      hoverGlow: "group-hover:shadow-cyan-500/10",
      badge: "AES-256",
      badgeCls:
        "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
    },
    {
      id: "card",
      title: "Payment Card",
      description: "Credit, debit, and virtual cards.",
      icon: <CreditCard className="w-5 h-5 md:w-6 md:h-6" />,
      color: "indigo",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
      hoverBorder: "hover:border-indigo-500/50 dark:hover:border-indigo-500/50",
      accentBar: "bg-indigo-500",
      hoverGlow: "group-hover:shadow-indigo-500/10",
      badge: "Encrypted",
      badgeCls:
        "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "note",
      title: "Secure Note",
      description: "Recovery codes, PINs, and private text.",
      icon: <StickyNote className="w-5 h-5 md:w-6 md:h-6" />,
      color: "orange",
      bgColor: "bg-orange-50 dark:bg-orange-900/30",
      textColor: "text-orange-600 dark:text-orange-400",
      hoverBorder: "hover:border-orange-500/50 dark:hover:border-orange-500/50",
      accentBar: "bg-orange-500",
      hoverGlow: "group-hover:shadow-orange-500/10",
      badge: "Private",
      badgeCls:
        "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
    {
      id: "identity",
      title: "Identity",
      description: "Personal info, addresses, and passports.",
      icon: <User className="w-5 h-5 md:w-6 md:h-6" />,
      color: "purple",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400",
      hoverBorder: "hover:border-purple-500/50 dark:hover:border-purple-500/50",
      accentBar: "bg-purple-500",
      hoverGlow: "group-hover:shadow-purple-500/10",
      badge: "Zero-Knowledge",
      badgeCls:
        "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
  ];

  const tag = {
    label: "Zero-Knowledge Architecture",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    cls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50",
  };

  return (
    <div
      className={`w-full transition-all duration-300 ease-in-out mx-auto space-y-8 scroll-bar-hide py-5`}
    >
      {/* STATE 1: CATEGORY GRID */}
      {!selectedCategory && (
        <ScrollReveal className="space-y-8">
          <div className="md:sticky -top-1 z-10 flex items-center w-[104%] -translate-x-[2%] gap-2 md:gap-4 border-b border-gray-200/50 dark:border-gray-800/50 pl-4 md:pl-12 py-2 md:py-4 bg-gray-50 dark:bg-gray-950">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-inter text-gray-900 dark:text-white">
                Add New Entry
              </h2>
              <p className="font-roboto text-gray-600 dark:text-gray-400 mt-1 font-medium text-sm">
                What do you want to secure today?
              </p>
              <ScrollReveal className="pt-3" direction="right" delayMs={100}>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-extrabold font-inter ${tag.cls}`}
                >
                  {tag.icon}
                  {tag.label}
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.id} delayMs={50 * i} direction="right">
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group w-full h-full relative text-left p-4 md:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cat.hoverBorder} ${cat.hoverGlow} overflow-hidden cursor-pointer`}
                >
                  {/* Left accent bar */}
                  <div
                    className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${cat.accentBar} opacity-0 group-hover:opacity-100 transition-all duration-300`}
                  />

                  {/* Background Hover Glow */}
                  <div
                    className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 bg-${cat.color}-500`}
                  />

                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon Container */}
                    <div
                      className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${cat.bgColor} ${cat.textColor}`}
                    >
                      {cat.icon}
                    </div>

                    {/* Text + badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                          {cat.title}
                        </h3>
                        {/* Security badge */}
                        <span
                          className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${cat.badgeCls} opacity-0 group-hover:opacity-100 transition-all duration-300`}
                        >
                          <Lock className="w-2.5 h-2.5" />
                          {cat.badge}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {cat.description}
                      </p>
                      {/* Encryption assurance line */}
                      <p className="mt-2 text-[10px] font-semibold text-gray-400 dark:text-gray-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                        Encrypted before saving
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 pt-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gray-400 dark:text-gray-500">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>

          {/* Zero-Knowledge Disclaimer premium */}
          <ScrollReveal
            direction="up"
            delayMs={250}
            className="flex items-center gap-4 p-4 my-4 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/40"
          >
            <div className="shrink-0 p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                Everything you add is locally encrypted with{" "}
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  AES-256-GCM
                </span>{" "}
                before syncing.{" "}
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  We never see your data.
                </span>
              </p>
            </div>
            <div className="shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
          </ScrollReveal>
        </ScrollReveal>
      )}

      {/* STATE 2: THE ACTUAL FORMS */}
      {selectedCategory && (
        <div className="space-y-6 duration-300">
          {/* Back Button & Header */}
          <div className="sticky -top-1 z-50 flex items-center gap-2 w-[104%] -translate-x-[2%] md:gap-4 border-b border-gray-200/50 dark:border-gray-800/50 pl-4 md:pl-12 py-2 md:py-4 bg-gray-50 dark:bg-gray-950">
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold font-inter text-gray-900 dark:text-white">
                {categories.find((c) => c.id === selectedCategory)?.title}
              </h2>
            </div>
          </div>

          {/* Form Area - Switch case */}
          <div className="rounded-[2rem] pb-4">
            {selectedCategory === "login" && <LoginForm />}
            {selectedCategory === "passcode" && <PinForm />}
            {/* {selectedCategory === "card" && <PaymentCardForm />} */}
            {!["login", "passcode",].some(
              (id) => id === selectedCategory,
            ) && (
              <ComingSoonForm
                {...categories.find(
                  (category) => category.id === selectedCategory,
                )}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
