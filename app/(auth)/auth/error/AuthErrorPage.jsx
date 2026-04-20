"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawError = searchParams.get("error");

  const errorMap = {
    CredentialsSignin: "Invalid email or password",
    AccessDenied: "Access denied",
    OAuthAccountNotLinked: "Use the correct login method",
    EMAIL_NOT_VERIFIED: "Please verify your email first",
  };

  const errorMessage = rawError
    ? errorMap[rawError] || decodeURIComponent(rawError)
    : "Something went wrong during authentication.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 text-center transition-all">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          Auth Error
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {errorMessage}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
