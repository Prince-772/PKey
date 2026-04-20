"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LoaderCircle, Lock, RotateCcw, TriangleAlert } from "lucide-react"; // Icons
import Logo from "@/components/logo";
import Link from "next/link";
import { VerifyTokenResetvault } from "@/lib/user/resetvault/getEmail";
import { useSession } from "next-auth/react";
import { useMasterPass } from "@/context/MasterPassword";
import { ResetVault } from "@/lib/user/resetvault/resetVault";

export default function ResetVaultPage() {
  const [loading, setLoading] = useState(true); // Initial loading for token verification
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false); // State to track if token is valid
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission loading
  const {data: session, update} = useSession()
  const { setEncKey, setMasterPass, setMasterPassSet } = useMasterPass()
  const params = useParams();
  const router = useRouter();
  const { token } = params; // Extract token from URL params
  
  // Effect to verify token and fetch email on component mount
  useEffect(() => {
    (async () => {
      await toast.promise(VerifyTokenResetvault(token), {
        loading: "Verifying Token...",
        success: (res) => {
          setEmail(res.data.email);
          setLoading(false);
          setIsTokenValid(true);
          return "Token verified!";
        },
        error: (err) => {
          setError(err.message);
          setLoading(false);
          setIsTokenValid(false);
          return err.message || "Token verification failed.";
        },
      });
    })();
  }, [token]);

  // Handle vault reset form submission
  const onSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await toast.promise(ResetVault(token), {
        loading: "Resetting...",
        success: async (res) => {
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
          setMasterPass(null)
          setEncKey(null)
          setMasterPassSet(true)
          if (session) {
            await update({
                  ...session,
                  user: {
                    ...session.user,
                    salt: null,
                  },
                });
          }
          return res.message || "Vault reset successfully!";
        },
        error: (err) => err.message || "Something went wrong!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div>
          <h2 className="mt-3 font-inter text-center text-3xl font-extrabold text-gray-900 dark:text-gray-50">
            Reset Your vault
          </h2>
          {email && (
            <p className="mt-2 text-center font-roboto text-sm text-blue-600 dark:text-blue-400 font-medium">
              For: {email}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <LoaderCircle className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Verifying token...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-2">
            <p className="text-red-600 dark:text-red-400 text-lg font-semibold flex items-center justify-center gap-2">
              <TriangleAlert className="w-5 h-5" /> {error}
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        ) : (
          isTokenValid && (
            <div className="border-0 flex justify-center items-center flex-col">
              <div className="mt-4 rounded-xl border-2 border-red-400 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />

                  <div>
                    <h3 className="text-sm md:text-[16px] font-semibold text-red-700 dark:text-red-300">
                      Important Notice
                    </h3>

                    <p className="mt-1 text-sm md:text-[16px] text-red-600 dark:text-red-400">
                      Resetting your vault will permanently remove all stored
                      data. This action cannot be undone.
                    </p>

                    <p className="mt-2 text-sm md:text-[16px] font-medium text-red-700 dark:text-red-300">
                      Please proceed only if you fully understand the
                      consequences.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onSubmit}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full shadow-lg mt-4 bg-linear-to-r from-red-600 to-red-700 text-white font-bold text-lg hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />{" "}
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2" /> Reset Vault
                  </>
                )}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
