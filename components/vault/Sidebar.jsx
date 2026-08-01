"use client";

import ScrollReveal from "@/components/ScrollReveal";
import {
  ChevronLeft,
  ChevronRight,
  Hash,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import PasswordIcon from "./PasswordIcon";

const filters = [
  {
    id: "all",
    text: "All",
    icon: <ShieldCheck className="w-4 md:w-6 h-4 md:h-6" />,
  },
  {
    id: "passwords",
    text: "Passwords",
    icon: <PasswordIcon className="w-4 md:w-6 h-4 md:h-6" />,
  },
  {
    id: "passcodes",
    text: "Passcodes",
    icon: <Hash className="w-4 md:w-6 h-4 md:h-6" />,
  },
];

const colorClasses = {
  warning: {
    text: "text-amber-600 dark:text-amber-400",
    hover: "hover:bg-amber-50 dark:hover:bg-amber-900/20",
    gradient: "from-amber-500/5 to-orange-500/5",
  },
  danger: {
    text: "text-red-600 dark:text-red-400",
    hover: "hover:bg-red-50 dark:hover:bg-red-900/20",
    gradient: "from-red-500/5 to-rose-500/5",
  },
};

export default function Sidebar({
  expanded,
  onExpandChange,
  onLockVault,
  onLogOut,
  encKey,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFilter = searchParams.get("type");
  const isValidFilter = filters.some(({ id }) => id === queryFilter);
  const selectedFilter = isValidFilter ? queryFilter : "all";

  useEffect(() => {
    if (queryFilter && !isValidFilter) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("type");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
  }, [queryFilter, isValidFilter, pathname, router, searchParams]);

  const applyFilter = (filter) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filter === "all") params.delete("type");
    else params.set("type", filter);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const actionButtons = [
    {
      label: "Lock Vault",
      icon: Lock,
      onClick: onLockVault,
      color: "warning",
      toShow: Boolean(encKey),
    },
    {
      label: "Log Out",
      icon: LogOut,
      onClick: onLogOut,
      color: "danger",
      toShow: true,
    },
  ];


  return (
    <div
      className={`flex fixed md:left-0 md:top-0 bottom-0 md:pt-16 z-5 md:h-screen w-screen flex-col transition-all duration-300 ease-in-out shadow-lg shadow-slate-500 dark:shadow-black ${
        expanded ? "md:w-64" : "md:w-18"
      }`}
    >
      <aside className="relative flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200/50 dark:border-gray-800/50 shadow-sm dark:shadow-gray-900 transition-colors duration-300 overflow-hidden">
        {/* Top Gradient Border */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-[0.5px] bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600" />
        {/* Toggle button */}
        <button
          type="button"
          onClick={() => onExpandChange((previous) => !previous)}
          aria-label={expanded ? "Collapse filters" : "Expand filters"}
          className={`hidden absolute right-5 top-3 z-5 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md md:flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:scale-110 active:scale-95`}
        >
          {expanded ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>

        <nav className="flex-1 border-t  md:border-t-0 overflow-y-auto scroll-bar-hide px-3 py-0 md:py-3 space-y-1 md:pt-5">
          <div
            className={`hidden md:block px-3 mb-3 overflow-hidden transition-all duration-200 ${expanded ? "opacity-100 h-5" : "opacity-0 h-0"}`}
          >
            <p className="text-nowrap text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest whitespace-nowrap">
              Filter Vault
            </p>
          </div>

          <div className="pt-2 md:pt-4 flex justify-around md:block">
            {filters.map(({ id, text, icon }, index) => {
              const active = selectedFilter === id;

              return (
                <ScrollReveal
                  delayMs={50 * (index + 1) * 2}
                  direction="down"
                  key={id}
                  // className="flex-1 md:block"
                  rootMargin="0px 0px -5% 0px"
                >
                  <button
                    type="button"
                    onClick={() => applyFilter(id)}
                    aria-current={active ? "page" : undefined}
                    className={`group relative w-full flex flex-col md:flex-row items-center justify-center md:justify-start md:mb-1 md:gap-3 px-3 pb-1 md:py-3 rounded-xl transition-all duration-200 overflow-hidden
                  ${
                    active
                      ? "md:bg-blue-50 md:dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 md:hover:bg-gray-100 md:dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <span className="absolute md:left-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-[min(50%,32px)] h-1 md:w-1 md:h-6 bg-blue-500 rounded-t-full md:rounded-r-full" />
                    )}

                    {/* Hover glow inactive only */}
                    {!active && (
                      <span className="absolute inset-0 rounded-xl md:bg-linear-to-r md:from-blue-500/0 md:to-purple-500/0 md:group-hover:from-blue-500/5 md:group-hover:to-purple-500/5 transition-all duration-300" />
                    )}

                    {/* Icon */}
                    <span
                      className={`relative z-5 shrink-0 transition-transform duration-200 ${!active ? "group-hover:scale-110" : ""}`}
                    >
                      {icon}
                    </span>

                    {/* Label */}
                    <span
                      className={`relative z-5 text-[10px] md:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                        expanded
                          ? "opacity-100 w-auto"
                          : "md:opacity-0 md:w-0 md:pointer-events-none"
                      }`}
                    >
                      {text}
                    </span>

                    {/* Tooltip collapsed only */}
                    {!expanded && (
                      <span className="absolute border-2 left-full ml-3 px-2.5 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-1 group-hover:translate-x-0 shadow-lg z-5">
                        {text}
                      </span>
                    )}
                  </button>
                </ScrollReveal>
              );
            })}
            <ScrollReveal
              delayMs={50 * (3 + 1) * 2}
              direction="down"
              rootMargin="0px 0px -5% 0px"
              className="md:border-t border-gray-600 dark:border-gray-400 md:pt-1 md:mt-1"
            >
              <Link
                href="/dashboard"
                className={`group relative w-full flex flex-col md:flex-row items-center justify-center md:justify-start md:mb-1 md:gap-3 px-3 pb-1 md:py-3 rounded-xl transition-all duration-200 overflow-hidden text-gray-600 dark:text-gray-400 md:hover:bg-gray-100 md:dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white`}
              >
                <span className="absolute inset-0 rounded-xl md:bg-linear-to-r md:from-blue-500/0 md:to-purple-500/0 md:group-hover:from-blue-500/5 md:group-hover:to-purple-500/5 transition-all duration-300" />

                {/* Icon */}
                <span
                  className={`relative z-5 shrink-0 transition-transform duration-200`}
                >
                  <Home className="w-4 h-4 md:w-6 md:h-6" />
                </span>

                {/* Label */}
                <span
                  className={`relative z-5 text-[10px] md:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    expanded
                      ? "opacity-100 w-auto"
                      : "md:opacity-0 md:w-0 md:pointer-events-none"
                  }`}
                >
                  Dashboard
                </span>

                {/* Tooltip collapsed only */}
                {!expanded && (
                  <span className="absolute border-2 left-full ml-3 px-2.5 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-1 group-hover:translate-x-0 shadow-lg z-5">
                    Vault
                  </span>
                )}
              </Link>
            </ScrollReveal>
          </div>
        </nav>

        {/* Bottom section */}
        <div className="hidden md:block shrink-0 p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">  
          {actionButtons.map(
            ({ label, icon: Icon, onClick, color, toShow }) => {
              if (!toShow) return null;
              const c = colorClasses[color];
              return (
                <button
                  key={label}
                  onClick={onClick}
                  className={`group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 overflow-hidden cursor-pointer ${c.text} ${c.hover}`}
                >
                  <span
                    className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-linear-to-r ${c.gradient} transition-opacity duration-300`}
                  />

                  <Icon className="w-5 h-5 shrink-0 relative z-5 transition-transform duration-200 group-hover:scale-110" />

                  <span
                    className={`relative z-5 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      expanded
                        ? "opacity-100 w-auto"
                        : "opacity-0 w-0 pointer-events-none"
                    }`}
                  >
                    {label}
                  </span>

                  {!expanded && (
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-1 group-hover:translate-x-0 shadow-lg z-5">
                      {label}
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>
      </aside>
    </div>
  );
}
