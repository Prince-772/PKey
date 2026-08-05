"use client";

// Shared skeleton shown while the auth session is still loading, so the
// dashboard/security pages don't flash the wrong locked-vs-setup state.

const shimmer =
  "relative overflow-hidden bg-gray-200 dark:bg-gray-800 rounded-xl after:absolute after:inset-0 after:translate-x-[-100%] after:animate-shimmer after:bg-linear-to-r after:from-transparent after:via-white/40 dark:after:via-white/10 after:to-transparent";

export default function DashboardSkeleton() {
  return (
    <div className="w-full mx-auto space-y-6 md:space-y-8 py-3 md:py-5">
      {/* Sticky header */}
      <div className="md:sticky -top-1 z-10 w-[104%] -translate-x-[2%] pl-4 md:pl-12 py-2 md:py-4 border-b border-gray-200/50 dark:border-gray-800/50 space-y-3">
        <div className={`${shimmer} h-6 w-56`} />
        <div className={`${shimmer} h-4 w-80 max-w-full`} />
        <div className={`${shimmer} h-6 w-32 mt-2`} />
      </div>

      {/* Hero card */}
      <div className={`${shimmer} h-40 md:h-48 w-[96%] mx-auto`} />

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-[96%] mx-auto">
        <div className={`${shimmer} h-32`} />
        <div className={`${shimmer} h-32`} />
      </div>

      {/* Rows  */}
      <div className="space-y-3 w-[96%] mx-auto">
        <div className={`${shimmer} h-16`} />
        <div className={`${shimmer} h-16`} />
        <div className={`${shimmer} h-16`} />
      </div>
    </div>
  );
}
