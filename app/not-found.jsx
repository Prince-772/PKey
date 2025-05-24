"use client";

import React from 'react';
import Link from 'next/link';
import { Frown, Home } from 'lucide-react'; // Icons for 404, home, help
import Logo from "@/components/logo";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* Main 404 Content */}
        <div className="flex flex-col items-center justify-center mb-6">
          <Frown className="w-20 h-20 text-blue-600 dark:text-blue-400 mb-4" />
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-50">
            404
          </h1>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Page Not Found
          </h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full shadow-lg
                       bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base
                       hover:from-blue-700 hover:to-purple-700
                       focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-200
                       transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5 mr-2" /> Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
