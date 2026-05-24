import { Plus, KeyRound } from "lucide-react";
import Link from "next/link";
import React from "react";
import ScrollReveal from '@/components/ScrollReveal';

const EmptyVault = () => {
  return (
    <ScrollReveal direction="up" className="w-full flex flex-col items-center justify-center pt-8 pb-4 px-4"> 
      <div className="w-full max-w-2xl flex flex-col items-center justify-center py-8 md:py-12 px-6 sm:px-10 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 text-center relative overflow-hidden group transition-colors duration-300 hover:border-blue-300 dark:hover:border-blue-800/50 hover:bg-white/60 dark:hover:bg-gray-900/60">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[60px] -z-10 group-hover:bg-blue-200/50 dark:group-hover:bg-blue-800/30 transition-colors duration-700 pointer-events-none" />

        <div className="w-20 h-20 mb-6 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-inner group-hover:scale-110 transition-transform duration-500 animate-[float_3s_ease-in-out_infinite]">
          <KeyRound className="w-10 h-10" />
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          Your Vault is Empty
        </h3>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 font-medium leading-relaxed">
          Every great fortress starts with a single key. Add your first password and experience zero-knowledge security.
        </p>

        <Link
          href="/dashboard"
          className="group/btn relative inline-flex items-center justify-center gap-2 px-4 md:px-8 py-3.5 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

          <Plus className="w-5 h-5 relative z-10 transition-all duration-300 border border-white/0 group-hover/btn:rotate-180 group-hover/btn:border-white rounded-full" />
          <span className="relative z-10">
            Secure Your First Entry
          </span>
        </Link>

      </div>
    </ScrollReveal>
  );
};

export default EmptyVault;