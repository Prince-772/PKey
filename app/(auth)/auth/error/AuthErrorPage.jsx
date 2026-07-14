"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawError = searchParams.get("error");

  const errorMap = {
    CredentialsSignin: "Invalid email or password.",
    AccessDenied: "Access denied. You don't have permission to sign in.",
    OAuthAccountNotLinked: "This email is linked to a different sign-in method.",
    OAUTH_ACCOUNT_EXISTS:
      "This account was not created using that provider. Try a different sign-in method.",
    EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
    RateLimited: "Too many attempts. Please wait a moment and try again.",
    Configuration: "There's a problem with the server configuration.",
    Verification: "This verification link is invalid or has expired.",
  };

  const errorMessage = rawError
    ? errorMap[rawError] || "Something went wrong during authentication."
    : "Something went wrong during authentication.";

  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-tl from-blue-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 px-6 relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-[120px] pointer-events-none" />

      <ScrollReveal direction="up" className="relative z-10 w-full max-w-md">
        <div className="p-8 md:p-10 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-center transition-all duration-300">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center border bg-rose-500/10 text-rose-500 border-rose-500/20">
              <ShieldAlert className="w-7 h-7" />
            </div>
          </div>

          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Authentication Error
          </p>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Sign-in{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
              Failed
            </span>
          </h1>

          <p className="text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-8">
            {errorMessage}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/sign-in")}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-3.5 px-6 rounded-2xl transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-semibold py-2 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Back to Home
            </button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}