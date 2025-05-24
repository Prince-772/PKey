"use client";

import React from 'react';
import Link from 'next/link';
import {
  Inbox,
  LockKeyhole,
  HardDrive,
  Share2,
  Trash2,
  Code,
  Mail,
} from 'lucide-react';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "information-we-collect",
      icon: <Inbox className="w-7 h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />,
      title: "Information We Collect",
      content: (
        <>
          We only collect the <span className="font-semibold">minimum data</span> required for you to use the app:
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li><span className="font-semibold">Email address</span> (for account identification)</li>
            <li><span className="font-semibold">Hashed master password</span> (not the actual one)</li>
            <li><span className="font-semibold">Encrypted passwords</span> (never stored in plain text)</li>
          </ul>
          <p className="mt-2">We <span className="font-bold text-red-600 dark:text-red-400">do not</span> track your behavior, device info, or any unnecessary personal data.</p>
        </>
      ),
    },
    {
      id: "your-master-password",
      icon: <LockKeyhole className="w-7 h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />,
      title: "Your Master Password",
      content: (
        <>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>We <span className="font-bold text-red-600 dark:text-red-400">do not store</span> your actual master password.</li>
            <li>We store only a <span className="font-semibold">hashed version</span>, which cannot be reversed.</li>
            <li>Encryption and decryption happen <span className="font-semibold">on your device</span>, not on our servers.</li>
          </ul>
          <p className="mt-3 font-semibold text-gray-800 dark:text-gray-200">Your secrets stay with you.</p>
        </>
      ),
    },
    {
      id: "password-storage",
      icon: <HardDrive className="w-7 h-7 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400" />,
      title: "Password Storage",
      content: (
        <>
          Your saved passwords are:
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>Encrypted using your master password.</li>
            <li>Stored securely in our database.</li>
            <li><span className="font-bold text-red-600 dark:text-red-400">Inaccessible to us</span> — we can't read or decrypt them.</li>
          </ul>
          <p className="mt-3 font-semibold text-gray-800 dark:text-gray-200">Only you can access your data.</p>
        </>
      ),
    },
    {
      id: "data-sharing",
      icon: <Share2 className="w-7 h-7 md:w-8 md:h-8 text-red-500 dark:text-red-400 transform -scale-x-100" />,
      title: "Data Sharing", // Icon is mirrored for a "no sharing" feel
      content: (
        <>
          We <span className="font-bold text-red-600 dark:text-red-400">never sell</span>, rent, or share your data with third parties.
          Your data is yours, and we respect that 100%.
        </>
      ),
    },
    {
      id: "data-retention-deletion",
      icon: <Trash2 className="w-7 h-7 md:w-8 md:h-8 text-red-600 dark:text-red-400" />,
      title: "Data Retention & Deletion",
      content: (
        <>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You can delete your account at any time.</li>
            <li>Once deleted, all your data (including saved passwords) is permanently erased.</li>
            <li>We <span className="font-bold">do not</span> keep backups of deleted user data.</li>
          </ul>
        </>
      ),
    },
    {
      id: "open-source-transparency",
      icon: <Code className="w-7 h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />,
      title: "Open Source Transparency",
      content: (
        <>
          This project is <span className="font-bold">open-source</span>.
          You can inspect how everything works at{" "}
          <Link
            href="https://github.com/Prince-772/PKey" // Replace with your actual GitHub Repo Link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors duration-200"
          >
            GitHub Repo <Code className="w-4 h-4" />
          </Link>
          .
          <p className="mt-2">We believe in trust through transparency.</p>
        </>
      ),
    },
    {
      id: "contact",
      icon: <Mail className="w-7 h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />,
      title: "Contact",
      content: (
        <>
          If you have questions about privacy or data handling, feel free to reach out at:{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            pkaddon772@gmail.com
          </span>{" "}
        </>
      ),
    },
  ];

  const effectiveDate = "May 24, 2025";

  return (<>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto text-center my-14">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          🛡️ Privacy Policy
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Effective Date:</span> {effectiveDate}
        </p>
        <p className="mt-4 text-md md:text-lg text-gray-700 dark:text-gray-300">
          Welcome to <span className="font-bold text-blue-600 dark:text-blue-400">PKey</span> — your privacy-focused password manager.
          This Privacy Policy explains how we handle your data, what we collect, and how we protect your privacy.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-10 md:gap-12">
        {sections.map((section) => (
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
            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16 md:mt-24 text-lg font-semibold text-gray-800 dark:text-gray-200">
        <p>
          <span className="text-blue-500">Your data, your control.</span>{" "}
          <span className="text-purple-500">Built with privacy at the core.</span>
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
