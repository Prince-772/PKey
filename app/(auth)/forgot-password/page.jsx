"use client";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { LoaderCircle, Mail, Send, TriangleAlert } from "lucide-react";
import Logo from "@/components/logo";
import Link from "next/link";
import { SendResetLink } from "@/lib/passwords/resetpassword/sendResetLink";

export default function ForgotPasswordPage() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();


  const onSubmit = async (data) => {
    try {
      await toast.promise(SendResetLink(data.email), {
        loading: "Sending...",
        success: "Reset link sent to yout email, and is valid only for 10 minutes",
        error: (err) => err.message || "Failed to send link"
      })
      reset();
    } catch (err) { }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div>
          <h2 className="mt-3 font-inter text-center text-3xl font-extrabold text-gray-900 dark:text-gray-50">
            Forgot Your Password?
          </h2>
          <p className="mt-2 font-inter text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email address below and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
          {/* Email Field */}
          <div className="group">
            <label
              htmlFor="email"
              className="px-2 text-sm font-medium
                         text-gray-700 dark:text-gray-300
                         transform transition-all duration-200 ease-in-out
                         group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
              Email Address
            </label>
            <div className="relative">
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}

                id="email"
                type="email"
                className="peer w-full px-4 py-2.5 border-2 rounded-lg
                             bg-gray-50 dark:bg-gray-700
                             border-gray-300 dark:border-gray-600
                             text-gray-900 dark:text-gray-100
                              outline-none
                             focus:border-blue-500 dark:focus:border-blue-400
                             transition duration-200 text-lg pr-10"
                aria-label="Email Address"
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          {errors.email && (
            <p className="text-red-600 dark:text-red-400 text-sm -mt-3 flex items-center gap-1">
              <TriangleAlert className="w-4 h-4" />{errors.email.message}
            </p>
          )}


          {/* Send Reset Link Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full shadow-lg mt-4
                       bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg
                       hover:from-blue-700 hover:to-purple-700
                       focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-200
                       transition-all duration-300 ease-in-out transform hover:-translate-y-1
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="w-5 h-5 mr-2 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" /> Send Reset Link
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
