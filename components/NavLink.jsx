"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const NavLink = ({ href, icon, label, openInNewTab }) => {
  const content = (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="flex justify-center gap-2 p-1.5 sm:px-4 sm:py-2 rounded-full 
           bg-gray-50/50 dark:bg-gray-900/50 
           text-gray-700 dark:text-gray-200 
           hover:text-blue-600 hover:dark:text-blue-400
           border border-gray-200/50 dark:border-gray-700/50 
           hover:border-blue-500
           shadow-sm hover:shadow-md transition-all duration-300 dark:shadow-gray-900
           text-sm md:text-base font-bold cursor-pointer group"
    >
      <span className="transition-transform duration-300 group-hover:scale-110 my-auto">
        {icon}
      </span>

      <span className="hidden sm:inline transition-transform duration-300 my-auto">
        {label}
      </span>
    </motion.div>
  );

  return openInNewTab ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href}>{content}</Link>
  );
};

export default NavLink;