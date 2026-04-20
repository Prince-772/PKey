"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Lock, Key, Globe } from "lucide-react";

const Section1 = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gray-50 dark:bg-gray-950 overflow-hidden py-10 rounded-2xl transition-all duration-300">
      {/*High-End Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-1/4 w-full h-full bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] animate-pulse transition-all duration-300" />
        <div className="absolute bottom-0 -right-1/4 w-full h-full bg-purple-500/10 dark:bg-purple-600/5 rounded-full blur-[120px] animate-pulse animation-delay-2000 transition-all duration-300" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-16"
        >
          {/*Left Side: Text Content */}
          <div className="w-full lg:w-3/5 text-center lg:text-left space-y-8">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs md:text-sm font-black tracking-widest uppercase transition-all duration-300"
            >
              <div className="flex justify-center items-center gap-2">
                <ShieldCheck className="w-6 h-6" />{" "}
                <p>Next-Gen Vault Security</p>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter text-gray-900 dark:text-white transition-colors duration-300"
            >
              Your Digital Keys, <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
                Secured with PKey
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed transition-colors duration-300"
            >
              Generate unbreakable passwords and store your digital life in a
              zero-knowledge encrypted vault.
              <span className="hidden md:inline">
                {" "}
                Local encryption. Global access. Total peace of mind.
              </span>
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="font-inter flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link
                href={isLoggedIn ? "/dashboard" : "/signup"}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white rounded-full bg-linear-to-r from-blue-600 to-purple-600 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2">
                  Get Started Securely{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>

              <Link
                href="/master-password"
                className="px-8 py-4 font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                How it works?
              </Link>
            </motion.div>
          </div>

          {/*Right Side: Visual Masterpiece */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-2/5 relative flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-[450px]">
              {/* Floating Security Elements Animation */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 right-0 z-20 bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all duration-300"
              >
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 transition-all duration-300">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase font-inter">
                    Status
                  </p>
                  <p className="text-sm font-bold font-inter">AES-256 Active</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-10 left-0 z-20 bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all duration-300"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 transition-all duration-300">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase font-inter">
                    Privacy
                  </p>
                  <p className="text-sm font-bold font-inter">Zero Knowledge</p>
                </div>
              </motion.div>

              {/* Main Graphic Placeholder */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-600/20 rounded-[40px] scale-105 blur-lg" />
              <div className="relative z-10 w-full h-full rounded-[40px] border flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/hero2.webp"
                  alt="PKey Security Illustration"
                  width={500}
                  height={500}
                  className="object-contain rounded-[40px] drop-shadow-[0_20px_50px_rgba(37,99,235,0.3)] border border-purple-500 shrink-0 select-none"
                  priority
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section1;
