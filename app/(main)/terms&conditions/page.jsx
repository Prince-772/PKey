"use client";

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle, // Acceptance of Terms
  User, // User Account
  Lock, // Security and Master Password
  Ban, // Prohibited Use
  Wrench, // Modifications to the Service
  XCircle, // Termination
  Archive, // Data and Backups
  Code, // Open Source Notice
  Mail, // Contact Us
} from 'lucide-react';
import Footer from '@/components/Footer';

export default function TermsAndConditionsPage() {
  const sections = [
    {
      id: "acceptance-of-terms",
      icon: <CheckCircle className="w-7 h-7 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400" />,
      title: "Acceptance of Terms",
      content: (
        <>
          By accessing or using PKey, you agree to be bound by these Terms and our Privacy Policy.
          If you do not agree, please do not use the service.
        </>
      ),
    },
    {
      id: "user-account",
      icon: <User className="w-7 h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />,
      title: "User Account",
      content: (
        <>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You must provide accurate and complete information during registration.</li>
            <li>You are responsible for maintaining the security of your account and master password.</li>
            <li>Do not share your account with others.</li>
          </ul>
        </>
      ),
    },
    {
      id: "security-master-password",
      icon: <Lock className="w-7 h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />,
      title: "Security and Master Password",
      content: (
        <>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You are solely responsible for remembering your master password.</li>
            <li>We <span className="font-bold text-red-600 dark:text-red-400">do not store</span> your master password — losing it means we can't recover your data.</li>
            <li>For security reasons, encryption and decryption happen on your device.</li>
          </ul>
        </>
      ),
    },
    {
      id: "prohibited-use",
      icon: <Ban className="w-7 h-7 md:w-8 md:h-8 text-red-600 dark:text-red-400" />,
      title: "Prohibited Use",
      content: (
        <>
          You agree <span className="font-bold text-red-600 dark:text-red-400">not to</span>:
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>Use the service for any illegal activities.</li>
            <li>Attempt to access other users’ data.</li>
            <li>Reverse-engineer or misuse our code or API.</li>
          </ul>
        </>
      ),
    },
    {
      id: "modifications-to-service",
      icon: <Wrench className="w-7 h-7 md:w-8 md:h-8 text-orange-500 dark:text-orange-400" />,
      title: "Modifications to the Service",
      content: (
        <>
          We may update or modify the service at any time.
          We will notify users of major changes, but minor adjustments may be rolled out without notice.
        </>
      ),
    },
    {
      id: "termination",
      icon: <XCircle className="w-7 h-7 md:w-8 md:h-8 text-red-600 dark:text-red-400" />,
      title: "Termination",
      content: (
        <>
          We reserve the right to suspend or terminate your access if:
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>You violate these terms.</li>
            <li>We suspect malicious behavior or abuse.</li>
          </ul>
          <p className="mt-2">Upon termination, your data may be deleted from our systems.</p>
        </>
      ),
    },
    {
      id: "data-and-backups",
      icon: <Archive className="w-7 h-7 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" />,
      title: "Data and Backups",
      content: (
        <>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You are responsible for exporting or backing up your data.</li>
            <li>We are not liable for any data loss due to forgotten master passwords or misuse.</li>
          </ul>
        </>
      ),
    },
    {
      id: "open-source-notice",
      icon: <Code className="w-7 h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />,
      title: "Open Source Notice",
      content: (
        <>
          PKey is an <span className="font-bold">open-source</span> project.
          You may explore the source code under the relevant open-source license at{" "}
          <Link
            href="https://github.com/Prince-772/PKey" // Replace with your actual GitHub Repo Link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors duration-200"
          >
            GitHub Repo <Code className="w-4 h-4" />
          </Link>
          .
        </>
      ),
    },
    {
      id: "contact-us",
      icon: <Mail className="w-7 h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />,
      title: "Contact Us",
      content: (
        <>
          If you have questions or need support, reach out at:{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            pkaddon772@gmail.com
          </span>{" "}
        </>
      ),
    },
  ];

  const effectiveDate = "May 24, 2025";

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100">
        <div className="max-w-4xl mx-auto text-center my-14">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            📜 Terms and Conditions
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Effective Date:</span> {effectiveDate}
          </p>
          <p className="mt-4 text-md md:text-lg text-gray-700 dark:text-gray-300">
            Welcome to <span className="font-bold text-blue-600 dark:text-blue-400">PKey</span>. By using our service, you agree to the following terms and conditions. Please read them carefully.
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
            <span className="text-blue-500">Thank you for using PKey</span> —{" "}
            <span className="text-purple-500">built for privacy, powered by trust.</span>
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
