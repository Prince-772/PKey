import { RefreshCcw, SearchX } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const NoMatchFound = ({ ClearFilters }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex flex-col items-center justify-center pt-8 pb-4"
    >
      <div className="w-full flex flex-col items-center justify-center py-8 md:py-12 px-6 sm:px-10 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 text-center relative overflow-hidden group transition-colors duration-300 hover:border-blue-300 dark:hover:border-blue-800/50 hover:bg-white/60 dark:hover:bg-gray-900/60">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gray-200/30 dark:bg-gray-800/30 rounded-full blur-[60px] -z-10 group-hover:bg-blue-400/10 dark:group-hover:bg-blue-500/10 transition-colors duration-700 pointer-events-none" />

        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 mb-6 rounded-[1.5rem] bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-inner group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-500"
        >
          <SearchX className="w-10 h-10" />
        </motion.div>

        <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          No Matches Found
        </h3>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 font-medium">
          We couldn't find any digital keys matching your current filters. Try adjusting your search to reveal your vault items.
        </p>

        <button
          onClick={ClearFilters}
          className="group/btn relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold transition-all duration-300 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          
          <RefreshCcw className="w-5 h-5 relative z-10 transition-all duration-500 group-hover/btn:-rotate-180 group-hover/btn:text-white" />
          <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-white">
            Clear All Filters
          </span>
        </button>

      </div>
    </motion.div>
  );
};

export default NoMatchFound;