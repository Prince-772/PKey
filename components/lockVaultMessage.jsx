import { Lock, Unlock, Shield, ShieldCheck } from "lucide-react";
import React from "react";
import ScrollReveal from '@/components/ScrollReveal';

const VaultIsLocked = ({ onUnLoack }) => {
  return (
    <ScrollReveal direction="up" className="w-full flex flex-col items-center justify-center py-5 relative px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[10vh] bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center justify-center py-8 md:py-12 px-6 sm:px-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-gray-200/80 dark:border-gray-800/80 shadow-2xl shadow-blue-500/5 dark:shadow-none text-center group ">
        <button
          onClick={onUnLoack}
          className="w-24 h-24 mb-8 rounded-full cursor-pointer bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-inner relative"
        >
          <span className="absolute inset-0 rounded-full animate-ping bg-blue-400/20 pointer-events-none" />
          <div className="absolute inset-2 rounded-full border border-blue-500/20 dark:border-blue-400/20" />
          <Lock className="w-10 h-10 text-emerald-500" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-2 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wide font-inter">
          <ShieldCheck className="w-4 h-4 shrink-0" /> Zero-Knowledge Security Active
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          Vault is Locked
        </h1>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-10 font-medium leading-relaxed max-w-sm mx-auto">
          Your digital keys are safely encrypted. Enter your Master Password to
          decrypt and access your vault.
        </p>

        <button
          onClick={onUnLoack}
          className="group/btn relative inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-lg transition-all duration-300 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10 flex items-center gap-2.5 transition-colors duration-300 group-hover/btn:text-white">
            <Lock className="w-5 h-5 block group-hover/btn:hidden shrink-0" />
            <Unlock className="w-5 h-5 hidden group-hover/btn:block shrink-0 duration-300" />
            Unlock Vault
          </div>
        </button>
      </div>
    </ScrollReveal>
  );
};

export default VaultIsLocked;