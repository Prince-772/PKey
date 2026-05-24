"use client";
import React from "react";
import Link from "next/link";
import ScrollReveal from '@/components/ScrollReveal';
import {
  Inbox, LockKeyhole, HardDrive, Share2, Trash2, Code, Mail
} from "lucide-react";
import Footer from "@/components/Footer";
import { BackToHomeBtn } from "@/components/backToHomeBtn";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "information-we-collect",
      icon: <Inbox className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Information We Collect",
      // Blue tinted background and border classes
      cardTheme: "bg-blue-50/30 dark:bg-blue-900/5 border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/80 dark:hover:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/50",
      content: (
        <>
          <p className="mb-4">We only collect the <span className="font-bold text-gray-900 dark:text-white">minimum data</span> required for you to use the app:</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
              <span><span className="font-bold text-gray-900 dark:text-white">Email address</span> — for account identification and alerts.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
              <span><span className="font-bold text-gray-900 dark:text-white">Hashed master password</span> — for authentication (not the actual one).</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><span className="font-bold text-gray-900 dark:text-white">Encrypted passwords</span> — strictly in cipher text.</span>
            </li>
          </ul>
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-800 dark:text-blue-300 font-medium">
            We <span className="font-bold">do not</span> track your behavior, device info, or any unnecessary personal data.
          </div>
        </>
      ),
    },
    {
      id: "your-master-password",
      icon: <LockKeyhole className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: "Your Master Password",
      // Purple tinted background and border classes
      cardTheme: "bg-purple-50/30 dark:bg-purple-900/5 border-purple-100 dark:border-purple-800/30 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50/80 dark:hover:bg-purple-900/20",
      iconBg: "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800/50",
      content: (
        <>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span>We <span className="font-bold text-red-500">do not store</span> your actual master password.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 mt-2 shrink-0" />
              <span>We store only a <span className="font-bold text-gray-900 dark:text-white">hashed version</span>, which cannot be reversed.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 mt-2 shrink-0" />
              <span>Encryption and decryption happen <span className="font-bold text-gray-900 dark:text-white">on your device</span>, not on our servers.</span>
            </li>
          </ul>
          <p className="font-bold text-lg text-purple-600 dark:text-purple-400">Your secrets stay with you.</p>
        </>
      ),
    },
    {
      id: "password-storage",
      icon: <HardDrive className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Password Storage",
      cardTheme: "bg-emerald-50/30 dark:bg-emerald-900/5 border-emerald-100 dark:border-emerald-800/30 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/20",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800/50",
      content: (
        <>
          <p className="mb-4">Your saved passwords are:</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>Encrypted using your master password.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>Stored securely in our database.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><span className="font-bold text-red-500">Inaccessible to us</span> — we can't read or decrypt them.</span>
            </li>
          </ul>
          <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Only you can access your data.</p>
        </>
      ),
    },
    {
      id: "data-sharing",
      icon: <Share2 className="w-6 h-6 text-rose-600 dark:text-rose-400 transform -scale-x-100" />,
      title: "Data Sharing",
      // Rose tinted background and border classes
      cardTheme: "bg-rose-50/30 dark:bg-rose-900/5 border-rose-100 dark:border-rose-800/30 hover:border-rose-200 dark:hover:border-rose-800 hover:bg-rose-50/80 dark:hover:bg-rose-900/20",
      iconBg: "bg-rose-100 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800/50",
      content: (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50">
          <p className="text-rose-800 dark:text-rose-300 font-medium leading-relaxed">
            We <span className="font-black text-rose-600 dark:text-rose-400">never sell</span>, rent, or share your data with third parties. Your data is yours, and we respect that 100%. No ads. No tracking pixels.
          </p>
        </div>
      ),
    },
    {
      id: "data-retention-deletion",
      icon: <Trash2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: "Data Retention & Deletion",
      // Amber tinted background and border classes
      cardTheme: "bg-amber-50/30 dark:bg-amber-900/5 border-amber-100 dark:border-amber-800/30 hover:border-amber-200 dark:hover:border-amber-800 hover:bg-amber-50/80 dark:hover:bg-amber-900/20",
      iconBg: "bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800/50",
      content: (
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 mt-2 shrink-0" />
            <span>You can delete your account at any time.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 mt-2 shrink-0" />
            <span>Once deleted, all your data (including saved passwords) is permanently erased.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
            <span>We <span className="font-bold text-gray-900 dark:text-white">do not</span> keep backups of deleted user data.</span>
          </li>
        </ul>
      ),
    },
    {
      id: "open-source-transparency",
      icon: <Code className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      title: "Open Source Transparency",
      cardTheme: "bg-sky-50/30 dark:bg-sky-900/5 border-sky-100 dark:border-sky-800/30 hover:border-sky-200 dark:hover:border-sky-800 hover:bg-sky-50/80 dark:hover:bg-sky-900/20",
      iconBg: "bg-sky-100 dark:bg-sky-900/40 border-sky-200 dark:border-sky-800/50",
      content: (
        <>
          <p className="mb-4">
            This project is <span className="font-bold text-gray-900 dark:text-white">open-source</span>. You can inspect how everything works at our repository to verify our claims.
          </p>
          <Link
            href="https://github.com/Prince-772/PKey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Code className="w-4 h-4" /> View GitHub Repo
          </Link>
          <p className="mt-6 font-bold text-sky-600 dark:text-sky-400">We believe in trust through transparency.</p>
        </>
      ),
    },
    {
      id: "contact",
      icon: <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Contact",
      // Indigo tinted background and border classes
      cardTheme: "bg-indigo-50/30 dark:bg-indigo-900/5 border-indigo-100 dark:border-indigo-800/30 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/50",
      content: (
        <>
          <p className="mb-4">If you have questions about privacy or data handling, feel free to reach out:</p>
          <a href="mailto:princek772.dev@gmail.com?subject=PKey Support: Issue/Feedback" className="inline-flex items-center gap-2 text-lg font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            princek772.dev@gmail.com
          </a>
        </>
      ),
    },
  ];

  const effectiveDate = "April 18, 2026"; 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-24">
        <ScrollReveal direction="up" className="text-center mb-20 flex flex-col items-center">
          <BackToHomeBtn extClassName="mt-4" />
          <h1 className="text-5xl md:text-7xl font-black font-inter mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight tracking-tighter">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Welcome to PKey — your privacy-focused password manager. Here is exactly how we handle and protect your data.
          </p>
          <div className="mt-8 px-5 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-400 inline-flex items-center gap-2">
             Effective Date: <span className="text-gray-900 dark:text-white">{effectiveDate}</span>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-8">
            {sections.map((section) => (
              <ScrollReveal direction="up" key={section.id}>
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
              </ScrollReveal>
            ))}

            {/* Bottom Section */}
            <ScrollReveal direction="up" delayMs={100} className="pt-8 pb-4 md:pt-16 md:pb-6 font-inter">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-6 md:p-12 text-center shadow-2xl shadow-blue-500/5 group">
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 blur-[80px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-inner">
                    <LockKeyhole className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                    Your data, <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">your control.</span>
                  </h3>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                    Built with privacy at the core. We protect your digital life with zero compromises.
                  </p>
                  
                  <BackToHomeBtn extClassName="hover:scale-105 transition-all duration-300" />
                </div>
              </div>
            </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}