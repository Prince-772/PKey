"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle, User, Lock, Ban, Wrench, XCircle, Archive, Code, Mail, ShieldCheck
} from "lucide-react";
import Footer from "@/components/Footer";
import { BackToHomeBtn } from "@/components/backToHomeBtn";

export default function TermsAndConditionsPage() {
  const sections = [
    {
      id: "acceptance-of-terms",
      icon: <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Acceptance of Terms",
      cardTheme: "bg-emerald-50/30 dark:bg-emerald-900/5 border-emerald-100 dark:border-emerald-800/30 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/20",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800/50",
      content: (
        <p className="leading-relaxed">
          By accessing or using PKey, you agree to be bound by these Terms and our Privacy Policy.
          If you do not agree with any part of these terms, please <span className="font-bold text-gray-900 dark:text-white">do not use the service</span>.
        </p>
      ),
    },
    {
      id: "user-account",
      icon: <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "User Account",
      cardTheme: "bg-blue-50/30 dark:bg-blue-900/5 border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/80 dark:hover:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/50",
      content: (
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
            <span>You must provide accurate and complete information during registration.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
            <span>You are responsible for maintaining the security of your account and master password.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
            <span><span className="font-bold text-gray-900 dark:text-white">Do not share</span> your account credentials with anyone else.</span>
          </li>
        </ul>
      ),
    },
    {
      id: "security-master-password",
      icon: <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: "Security & Master Password",
      cardTheme: "bg-purple-50/30 dark:bg-purple-900/5 border-purple-100 dark:border-purple-800/30 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50/80 dark:hover:bg-purple-900/20",
      iconBg: "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800/50",
      content: (
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
            <span>You are <span className="font-bold text-gray-900 dark:text-white">solely responsible</span> for remembering your master password.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
            <span>We <span className="font-bold text-red-500">do not store</span> your master password — losing it means your data is permanently locked.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
            <span>For maximum security, all encryption and decryption happen strictly on your local device.</span>
          </li>
        </ul>
      ),
    },
    {
      id: "prohibited-use",
      icon: <Ban className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: "Prohibited Use",
      cardTheme: "bg-rose-50/30 dark:bg-rose-900/5 border-rose-100 dark:border-rose-800/30 hover:border-rose-200 dark:hover:border-rose-800 hover:bg-rose-50/80 dark:hover:bg-rose-900/20",
      iconBg: "bg-rose-100 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800/50",
      content: (
        <>
          <p className="mb-4">You agree <span className="font-black text-rose-600 dark:text-rose-400">not to</span>:</p>
          <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span className="text-rose-800 dark:text-rose-300 font-medium">Use the service for any illegal, unauthorized, or fraudulent activities.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span className="text-rose-800 dark:text-rose-300 font-medium">Attempt to access, hack, or decipher other users’ data or vaults.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span className="text-rose-800 dark:text-rose-300 font-medium">Reverse-engineer, disrupt, or maliciously misuse our code or API infrastructure.</span>
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: "modifications-to-service",
      icon: <Wrench className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: "Modifications to the Service",
      cardTheme: "bg-amber-50/30 dark:bg-amber-900/5 border-amber-100 dark:border-amber-800/30 hover:border-amber-200 dark:hover:border-amber-800 hover:bg-amber-50/80 dark:hover:bg-amber-900/20",
      iconBg: "bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800/50",
      content: (
        <p className="leading-relaxed">
          We reserve the right to update, modify, or discontinue the service at any time.
          We will notify users of major structural changes, but minor adjustments, bug fixes, and security patches may be rolled out without prior notice.
        </p>
      ),
    },
    {
      id: "termination",
      icon: <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
      title: "Termination",
      cardTheme: "bg-red-50/30 dark:bg-red-900/5 border-red-100 dark:border-red-800/30 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50/80 dark:hover:bg-red-900/20",
      iconBg: "bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800/50",
      content: (
        <>
          <p className="mb-4">We reserve the right to suspend or terminate your access immediately if:</p>
          <ul className="space-y-3 mb-4">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span>You violate these terms or the Privacy Policy.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span>We suspect malicious behavior, bot activity, or system abuse.</span>
            </li>
          </ul>
          <p className="font-bold text-red-600 dark:text-red-400">Upon termination, your encrypted data will be permanently deleted from our servers.</p>
        </>
      ),
    },
    {
      id: "data-and-backups",
      icon: <Archive className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      title: "Data and Backups",
      cardTheme: "bg-teal-50/30 dark:bg-teal-900/5 border-teal-100 dark:border-teal-800/30 hover:border-teal-200 dark:hover:border-teal-800 hover:bg-teal-50/80 dark:hover:bg-teal-900/20",
      iconBg: "bg-teal-100 dark:bg-teal-900/40 border-teal-200 dark:border-teal-800/50",
      content: (
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
            <span>You are responsible for regularly exporting or backing up your data independently.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
            <span>We are <span className="font-bold text-gray-900 dark:text-white">not liable</span> for any data loss occurring due to forgotten master passwords, device failures, or user misuse.</span>
          </li>
        </ul>
      ),
    },
    {
      id: "open-source-notice",
      icon: <Code className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      title: "Open Source Notice",
      cardTheme: "bg-sky-50/30 dark:bg-sky-900/5 border-sky-100 dark:border-sky-800/30 hover:border-sky-200 dark:hover:border-sky-800 hover:bg-sky-50/80 dark:hover:bg-sky-900/20",
      iconBg: "bg-sky-100 dark:bg-sky-900/40 border-sky-200 dark:border-sky-800/50",
      content: (
        <>
          <p className="mb-4">
            PKey is an <span className="font-bold text-gray-900 dark:text-white">open-source</span> project. 
            You may explore, audit, or contribute to the source code under the relevant open-source license.
          </p>
          <Link
            href="https://github.com/Prince-772/PKey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Code className="w-4 h-4" /> View GitHub Repo
          </Link>
        </>
      ),
    },
    {
      id: "contact",
      icon: <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Contact Us",
      cardTheme: "bg-indigo-50/30 dark:bg-indigo-900/5 border-indigo-100 dark:border-indigo-800/30 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/50",
      content: (
        <>
          <p className="mb-4">If you have questions regarding these terms or need support, reach out at:</p>
          <a href="mailto:princek772.dev@gmail.com?subject=PKey Support: Issue/Feedback" className="inline-flex items-center gap-2 text-lg font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            princek772.dev@gmail.com
          </a>
        </>
      ),
    },
  ];

  const effectiveDate = "April 18, 2026"; 

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-24">
        
        {/* Hero Section  */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20 flex flex-col items-center"
        >
          <BackToHomeBtn extClassName="mt-4" />
          <h1 className="text-5xl md:text-7xl font-black font-inter mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight tracking-tighter">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Welcome to PKey. By using our service, you agree to the following terms and conditions. Please read them carefully.
          </p>
          <div className="mt-8 px-5 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-400 inline-flex items-center gap-2">
             Effective Date: <span className="text-gray-900 dark:text-white">{effectiveDate}</span>
          </div>
        </motion.div>
        <motion.div 
          className="max-w-3xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
            {sections.map((section) => (
              <motion.div key={section.id} variants={cardVariants}>
                <div className={`group p-6 md:p-8 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 ${section.cardTheme}`}>
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    

                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform duration-300 ${section.iconBg}`}>
                      {section.icon}
                    </div>
                    
                    <div className="w-full mt-1 sm:mt-0">
                      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 group-hover:text-current transition-colors duration-300">
                        {section.title}
                      </h2>
                      <div className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                        {section.content}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div variants={cardVariants} className="pt-8 pb-4 md:pt-16 md:pb-6 font-inter">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-10 md:p-16 text-center shadow-2xl shadow-blue-500/5 group">
                
  
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 blur-[80px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-inner">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                    Thank you for using <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">PKey.</span>
                  </h3>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                    Built for privacy, powered by trust. Your security is our absolute priority.
                  </p>
                  
                  <BackToHomeBtn extClassName="hover:scale-105 transition-all duration-300" />
                </div>
              </div>
            </motion.div>

        </motion.div>
      </main>
      <Footer />
    </div>
  );
}