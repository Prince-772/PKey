"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { LoaderCircle, Eye, EyeOff, Lock, TriangleAlert } from "lucide-react"; // Icons for password fields and loading
import Logo from "@/components/logo";
import { VerifyToken } from "@/lib/passwords/resetpassword/getEmail";
import Link from "next/link";
import { ResetPassword } from "@/lib/passwords/resetpassword/resetPassword";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(true); // Initial loading for token verification
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false); // State to track if token is valid
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission loading

  const params = useParams();
  const router = useRouter();
  const { token } = params; // Extract token from URL params

  const {
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm();

  const newPasswordValue = watch("newPassword", "");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Effect to verify token and fetch email on component mount
  useEffect(() => {
    (async () => {
      await toast.promise(VerifyToken(token), {
        loading: "Verifying token...",
        success: (res) => {
          setEmail(res.data.email)
          setLoading(false);
          setIsTokenValid(true);
          return "Token verified!"
        },
        error: (err) => {
          setError(err.message)
          setLoading(false);
          setIsTokenValid(false);
          return err.message || "Token verification failed."
        }
      })
    })()
  }, [token]);

  // Handle password reset form submission
  const onSubmit = async (data) => {
    await toast.promise(ResetPassword(token, data.newPassword), {
      loading: "Reseting...",
      success: (res) => {
        setTimeout(() => {
          router.push("/sign-in")
        }, 2000)
        return res.message || "Password reset successfully!"
      },
      error: (err) => err.message || "Something went wrong!"
    })
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">

        <div className="flex justify-center">
          <Logo />
        </div>

        <div>
          <h2 className="mt-3 font-inter text-center text-3xl font-extrabold text-gray-900 dark:text-gray-50">
            Reset Your Password
          </h2>
          <p className="mt-2 font-roboto text-center text-sm text-gray-600 dark:text-gray-400">
            Enter and confirm your new password below.
          </p>
          {email && (
            <p className="mt-2 text-center font-roboto text-sm text-blue-600 dark:text-blue-400 font-medium">
              For: {email}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <LoaderCircle className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying token...</p>
          </div>
        ) : error ? (
          <div className="text-center py-2">
            <p className="text-red-600 dark:text-red-400 text-lg font-semibold flex items-center justify-center gap-2">
              <TriangleAlert className="w-5 h-5" /> {error}
            </p>
            <Link
              href="/forgot-password"
              className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  {...register("newPassword", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" }, })}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 text-lg pr-10"
                />
                {showNewPassword ? (
                  <EyeOff
                    onClick={() => setShowNewPassword(false)}
                    className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowNewPassword(true)}
                    className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300"
                  />
                )}
              </div>
              {errors.newPassword && (
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...register("confirmPassword", { required: "Confirm Password is required", validate: (value) => value === newPasswordValue || "Passwords do not match" })}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 text-lg pr-10"
                />
                {showConfirmPassword ? (
                  <EyeOff
                    onClick={() => setShowConfirmPassword(false)}
                    className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowConfirmPassword(true)}
                    className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300"
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full shadow-lg mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" /> Resetting...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" /> Reset Password
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}