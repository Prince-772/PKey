import React, { useState } from "react";
import {
  Globe,
  StickyNote,
  CreditCard,
  User,
  ArrowLeft,
  ChevronRight,
  Fingerprint,
} from "lucide-react";
import LoginForm from "@/components/dashboard/forms/LoginForm";
import ScrollReveal from "@/components/ScrollReveal";

export default function AddEntryTab({ expanded }) {
  // State to track which form is currently open (null = show grid)
  const [selectedCategory, setSelectedCategory] = useState(null);

  // List of categories
  const categories = [
    {
      id: "login",
      title: "Login Credentials",
      description: "Websites, apps, and online service accounts.",
      icon: <Globe className="w-6 h-6" />,
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400",
      hoverBorder: "hover:border-blue-500/50 dark:hover:border-blue-500/50",
    },
    {
      id: "card",
      title: "Payment Card",
      description: "Credit, debit, and virtual cards.",
      icon: <CreditCard className="w-6 h-6" />,
      color: "emerald",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
      hoverBorder:
        "hover:border-emerald-500/50 dark:hover:border-emerald-500/50",
    },
    {
      id: "note",
      title: "Secure Note",
      description: "Recovery codes, PINs, and private text.",
      icon: <StickyNote className="w-6 h-6" />,
      color: "orange",
      bgColor: "bg-orange-50 dark:bg-orange-900/30",
      textColor: "text-orange-600 dark:text-orange-400",
      hoverBorder: "hover:border-orange-500/50 dark:hover:border-orange-500/50",
    },
    {
      id: "identity",
      title: "Identity",
      description: "Personal info, addresses, and passports.",
      icon: <User className="w-6 h-6" />,
      color: "purple",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400",
      hoverBorder: "hover:border-purple-500/50 dark:hover:border-purple-500/50",
    },
  ];

  return (
    <div
      className={`w-full transition-all duration-300 ease-in-out mx-auto space-y-8 scroll-bar-hide py-5`}
    >
      {/* STATE 1: CATEGORY GRID */}
      {!selectedCategory && (
        <ScrollReveal className="space-y-8">
          <div className="sticky top-0 z-1 flex items-center w-[104%] -translate-x-[2%] gap-4 border-b border-gray-200/50 dark:border-gray-800/50 pl-12 py-4 bg-gray-50 dark:bg-gray-950">
            <div>
              <h2 className="text-3xl font-bold font-inter text-gray-900 dark:text-white">
                Add New Entry
              </h2>
              <p className="font-roboto text-gray-600 dark:text-gray-400 mt-2 font-medium">
                What do you want to secure today?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.id} delayMs={50 * i} direction="right">
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group w-full relative text-left p-6 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cat.hoverBorder} overflow-hidden cursor-pointer`}
                >
                  {/* Background Hover Glow */}
                  <div
                    className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-${cat.color}-500`}
                  />

                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon Container */}
                    <div
                      className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${cat.bgColor} ${cat.textColor}`}
                    >
                      {cat.icon}
                    </div>

                    {/* Text Container */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {cat.description}
                      </p>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="shrink-0 pt-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gray-400 dark:text-gray-500">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
          

          {/* Zero-Knowledge Disclaimer */}
          <ScrollReveal
            direction="right"
            delayMs={250}
            className="flex items-center gap-3 p-4 my-4 rounded-2xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              <Fingerprint className="w-4 h-4" />
            </div>
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
              Everything you add is locally encrypted with{" "}
              <span className="font-bold text-gray-700 dark:text-gray-300">
                AES-256-GCM
              </span>{" "}
              before syncing.
            </p>
          </ScrollReveal>
        </ScrollReveal>
      )}

      {/* STATE 2: THE ACTUAL FORMS (Placeholders for now) */}
      {selectedCategory && (
        <div className="space-y-6 duration-300">
          {/* Back Button & Header */}
          <div className="sticky top-0 z-50 flex items-center gap-4 border-b border-gray-200/50 dark:border-gray-800/50 pl-12 py-4 bg-gray-50 dark:bg-gray-950">
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold font-inter text-gray-900 dark:text-white">
                {categories.find((c) => c.id === selectedCategory)?.title}
              </h2>
            </div>
          </div>

          {/* Form Area - Switch case banakar forms render karenge */}
          <div className="rounded-[2rem] shadow-sm pb-4">
            {selectedCategory === "login" && (
              <div className="text-gray-500">
                <LoginForm />
              </div>
            )}
            {selectedCategory === "card" && (
              <p className="text-gray-500">Comming Soon...</p>
            )}
            {selectedCategory === "note" && (
              <p className="text-gray-500">Comming Soon...</p>
            )}
            {selectedCategory === "identity" && (
              <p className="text-gray-500">Comming Soon...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
