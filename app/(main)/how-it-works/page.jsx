"use client";

import React from 'react';
import Link from 'next/link';
import {
  KeyRound,
  CloudOff,
  Unlock,
  Timer,
  AlertTriangle,
  ShieldCheck,
  Code,
} from 'lucide-react';
import Footer from '@/components/Footer';

export default function HowItWorksPage() {
  const sections = [
    {
      id: "what-is-master-password",
      icon: <KeyRound className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400" />,
      title: "What is the Master Password?",
      content: (
        <>
          The Master Password is your personal secret key. It is used to{" "}
          <span className="font-semibold text-blue-700 dark:text-blue-300">encrypt</span> and{" "}
          <span className="font-semibold text-blue-700 dark:text-blue-300">decrypt</span> your saved passwords. Only you know it. We don’t store it, and we can’t access it.
        </>
      ),
    },
    {
      id: "do-we-store-master-password",
      icon: <CloudOff className="w-8 h-8 md:w-10 md:h-10 text-red-500 dark:text-red-400" />,
      title: "Do We Store the Master Password?",
      content: (
        <>
          <span className="font-bold text-red-600 dark:text-red-400">No, never.</span> We{" "}
          <span className="font-semibold">only store a hashed version</span> of your master password (similar to how login systems store your login password). Hashing means it cannot be reversed to get the original password.
        </>
      ),
    },
    {
      id: "how-is-master-password-used",
      icon: <Unlock className="w-8 h-8 md:w-10 md:h-10 text-emerald-600 dark:text-emerald-400" />,
      title: "How is the Master Password Used?",
      content: (
        <>
          <ul>
            <li className="mb-2">When you log in or create your first password, we ask for a master password.</li>
            <li className="mb-2">Your actual passwords are encrypted using this master password — not stored as plain text.</li>
            <li>The encryption and decryption happen <span className="font-semibold text-purple-700 dark:text-purple-300">on your device</span> (client-side), not on our servers.</li>
          </ul>
        </>
      ),
    },
    {
      id: "what-happens-after-entering",
      icon: <Timer className="w-8 h-8 md:w-10 md:h-10 text-orange-500 dark:text-orange-400" />,
      title: "What Happens After Entering the Master Password?",
      content: (
        <>
          <ul>
            <li className="mb-2">It is temporarily stored in your browser (memory only, not localStorage).</li>
            <li className="mb-2">It auto-expires after <span className="font-semibold text-orange-600 dark:text-orange-300">5 minutes of inactivity</span> to keep your data safe.</li>
            <li>Each time you try to <span className="font-semibold">view, edit or delete</span> a password, we refresh the 5-minute timer.</li>
          </ul>
        </>
      ),
    },
    {
      id: "what-if-forgotten",
      icon: <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-600 dark:text-red-400" />,
      title: "What If I Forget My Master Password?",
      content: (
        <>
          Since we don't store the raw master password, we{" "}
          <span className="font-bold text-red-600 dark:text-red-400">cannot recover</span> it.
          You will have to delete your account and create a new one.
        </>
      ),
    },
    {
      id: "why-trust-system",
      icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-purple-600 dark:text-purple-400" />,
      title: "Why Trust This System?",
      content: (
        <>
          Because the entire source code is{" "}
          <Link
            href="https://github.com/Prince-772/PKey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors duration-200"
          >
            open-source <Code className="w-4 h-4" />
          </Link>{" "}
          — you can inspect how everything works. No secrets. No shady stuff. Just pure transparency and privacy-first design <span className="text-blue-500">💙</span>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100">
        <div className="max-w-4xl mx-auto text-center my-14 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            🔐 How It Works
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            Your privacy is our top priority. Here's how we handle your data securely, especially your master password:
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-10 md:gap-12">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700
                       transform hover:scale-[1.02] transition-transform duration-300 ease-in-out"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 flex-shrink-0">
                  {section.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-50">
                  {section.title}
                </h2>
              </div>
              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 md:mt-24 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <p>
            <span className="text-blue-500">Stay in control.</span>{" "}
            <span className="text-purple-500">Stay secure.</span>
          </p>
        </div>
        <Link
          href="/"
          className="mt-8 md:mt-12 mx-auto block w-fit px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  );
}
