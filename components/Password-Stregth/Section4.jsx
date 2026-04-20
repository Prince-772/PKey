"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertOctagon, Globe, Hash, Keyboard, LayoutGrid, Music, UserMinus } from "lucide-react";

export default function Section4() {
  const traps = [
    {
      id: "leetspeak",
      icon: <Keyboard className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: "The 'L33t Sp34k' Illusion",
      badExample: "P@ssw0rd1!",
      desc: "Replacing 'a' with '@' or 's' with '$' doesn't fool anyone anymore. Cracking algorithms test these exact substitutions instantly.",
    },
    {
      id: "padding",
      icon: <Hash className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: "The '123' Fallacy",
      badExample: "monkey123!",
      desc: "Adding sequential numbers or an exclamation mark at the end of a weak word does not make it strong. It's the oldest trick in the book.",
    },
    {
      id: "personal",
      icon: <UserMinus className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: "Personal Breadcrumbs",
      badExample: "tommy2015",
      desc: "Pet names, birthdays, anniversaries, or favorite sports teams. If it can be found on your social media, it shouldn't be your password.",
    },{
      id: "keyboard-walk",
      icon: <LayoutGrid className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: "The 'QWERTY' Walk",
      badExample: "1qaz2wsx3edc",
      desc: "Sliding your fingers across adjacent keys feels random, but cracking software tests physical keyboard layout patterns within milliseconds.",
    },
    {
      id: "lazy-unique",
      icon: <Globe className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: "The Lazy Unique",
      badExample: "Netflix@Pass",
      desc: "Appending the website's name to a base password is a fatal flaw. If one site is breached, algorithms instantly guess the variations for your other accounts.",
    },
    {
      id: "culture-ref",
      icon: <Music className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: "Pop Culture References",
      badExample: "StarWars2024",
      desc: "Movie characters, song lyrics, or famous quotes. Hackers use 'Culture Dictionaries' that include every popular movie and song title ever made.",
    }
  ];

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Warning Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 shadow-inner">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Common Password <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400">Traps</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            Avoid these predictable patterns at all costs. Hackers use automated dictionaries that check for these exact mistakes first.
          </p>
        </motion.div>

        {/* The Traps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {traps.map((trap) => (
            <motion.div key={trap.id} variants={itemVariants}>
              <div 
              tabIndex={0}
              className="relative h-full group px-4 py-8 md:p-8 rounded-2xl bg-white dark:bg-gray-900 border border-rose-100 dark:border-rose-900/30 shadow-sm hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-700/50 focus-within:shadow-xl focus-within:border-rose-300 dark:focus-within:border-rose-700/50 transition-all duration-300 overflow-hidden dark:shadow-[0_10px_30px_rgba(255,255,255,0.05)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.08)] dark:focus-within:shadow-[0_20px_40px_rgba(255,255,255,0.08)]">
                
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-rose-500/10 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-focus:opacity-100" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/20 group-hover:scale-110 group-focus:scale-110 transition-transform duration-300 shrink-0">
                      {trap.icon}
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 group-focus:text-rose-600 dark:group-focus:text-rose-400 transition-colors duration-300">
                      {trap.title}
                    </h3>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-1 ml-2 block">
                      Bad Example
                    </span>
                    <div className="px-4 py-2 mt-2 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800/50 rounded-xl text-rose-800 dark:text-rose-300 font-mono text-sm font-semibold inline-block line-through decoration-rose-500/50 decoration-2">
                      {trap.badExample}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium mt-auto">
                    {trap.desc}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}