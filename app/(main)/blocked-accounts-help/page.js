"use client";

import React from "react";
import Link from "next/link";
import {
  Lock,
  AlertTriangle,
  RotateCcw,
  BookOpen
} from "lucide-react";
import Logo from "@/components/logo";
import Footer from "@/components/Footer";

export default function AccountBlockedPage() {
  return (
    <>
      <div className="mt-24 font-roboto min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-8 border border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {/* Main Message */}
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <Lock className="w-16 h-16 text-red-600 dark:text-red-400 mb-4" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 dark:text-red-400">
              Account Blocked?
            </h1>
            <p className="mt-2 text-gray-700 dark:text-gray-300 max-w-2xl">
              If your account has been <strong>permanently blocked</strong> due
              to multiple incorrect master password attempts. This is a strict
              security measure to ensure your passwords remain safe.
            </p>
          </div>

          {/* Actions Section */}
          <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Here's what you can do:
            </h2>

            {/* Reset Vault */}
            <div className="flex gap-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <RotateCcw className="w-6 h-6 text-orange-500 dark:text-orange-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Reset Your Vault
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Since your account is blocked, the only way to reuse it is to
                  reset your vault. This deletes all saved data and lets you
                  start over with a new master password.
                </p>
                <div className="steps mt-3 text-sm text-gray-700 dark:text-gray-300">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Steps to Reset Your Vault:
                  </h4>
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li><Link href="/sign-in" className="text-blue-500 underline">Log in</Link> to your account.</li>
                    <li>
                      Click the <b>Profile</b> button in the top right corner.
                    </li>
                    <li>Click the <b>Reset Vault</b> option.</li>
                    <li>
                      Enter your account password (if you logged in with email)
                      to confirm.
                    </li>
                    <li>Create a new master password to set up your vault and start fresh.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Learn More */}
            <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Learn More
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Understand how we keep your data secure and why we don't store
                  your master password.
                </p>
              </div>
            </div>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-full shadow-lg
                       bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-base
                       hover:from-purple-700 hover:to-indigo-700
                       focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-200
                       transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <BookOpen className="w-5 h-5 mr-2" /> Master Password System
            </Link>
          </div>

          {/* Final Warning */}
          <div className="mt-10 text-center text-sm text-red-600 dark:text-red-400 font-semibold">
            <AlertTriangle className="inline w-4 h-4 mr-1" />
            Resetting your vault is <strong>permanent</strong>. Make sure you
            want to proceed.
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700 text-sm text-blue-800 dark:text-blue-200 italic text-center">
            <AlertTriangle className="inline w-4 h-4 mr-2 text-blue-700 dark:text-blue-300" />
            We <strong>never store</strong> your master password. We can't help
            recover it. So keep it safe next time.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
