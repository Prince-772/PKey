"use client";

import React from "react";
import { Bell, Clock, ShieldCheck } from "lucide-react";

const colorClasses = {
  emerald: {
    icon: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50",
    button:
      "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
  },
  orange: {
    icon: "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    badge:
      "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700/50",
    button:
      "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600",
  },
  purple: {
    icon: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    badge:
      "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/50",
    button:
      "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600",
  },
  blue: {
    icon: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    badge:
      "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50",
    button: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
  },
  cyan: {
    icon: "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
    badge:
      "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/50",
    button: "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600",
  },
};

const ComingSoonForm = ({ title, description, icon, color = "blue" }) => {
  const theme = colorClasses[color] ?? colorClasses.blue;

  return (
    <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="px-6 md:px-8 pt-7 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme.icon}`}
          >
            {icon}
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-10 flex flex-col items-center text-center gap-5">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black ${theme.badge}`}
        >
          <Clock className="w-3.5 h-3.5" />
          Coming Soon
        </div>

        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            This form is in progress
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
            The vault already has the encryption flow ready; this entry type
            will get its own tailored fields and save experience next.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg pt-2">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-3 text-left">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
              Client-side encryption planned
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-3 text-left">
            <Bell className="w-4 h-4 shrink-0 text-blue-500" />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
              Login entries are available now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonForm;
