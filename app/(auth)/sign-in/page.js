"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HandleSignIn } from "@/lib/auth/handleSign-in";
import Loader from "@/components/Loader/loader";
import {
  GoogleSignInButton,
  GitHubSignInButton,
} from "@/components/buttons.jsx";

import toast, { Toaster } from "react-hot-toast";
// import { handleResendVerification } from "@/lib/auth/handleResendEmail";
import axios from "axios";
import Logo from "@/components/logo";

const schema = z.object({
  emailOrUsername: z.string().min(1, "Email or Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function LoginPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const { data: session, status } = useSession();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const [isLoading, setIsLoading] = useState(false);
  const [showResendBtn, setShowResendBtn] = useState(false);

  const onSubmit = async ({ emailOrUsername, password }) => {
    try {
      await toast.promise(HandleSignIn({ emailOrUsername, password }), {
        loading: "Signing in...",
        success: () => {
          router.push("/dashboard");
          return <b>Signed in successfully!</b>;
        },
        error: (err) => {
          if (err.message.endsWith("EMAIL_NOT_VERIFIED")) {
            setShowResendBtn(true);
            return (
              <b>Email not verified. Please verify your email to continue.</b>
            );
          }
          return <b>{err.message || "Sign-in failed"}</b>;
        },
      });
      reset();
    } catch (error) {}
  };

  const onResend = async () => {
    const email = getValues("emailOrUsername");
    await toast.promise(
      axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/resend-verification`,
        { email }
      ),
      {
        loading: "Sending...",
        success: `Verification link sent to ${email}!`,
        error: (err) => err.message || "Failed to send verification link",
      }
    );
  };

  useEffect(() => {
    if (status === "loading") {
      toast.loading("Checking...", {
        duration: 2000,
        style: {
          border: "1px solid #3b82f6", // blue-500
          padding: "8px 12px",
          color: "#1e40af", // blue-800
          fontWeight: "500",
          fontFamily: "sans-serif",
        },
        iconTheme: {
          primary: "#3b82f6", // blue-500
          secondary: "#bfdbfe", // blue-200
        },
        removeDelay: 1000,
      });
    } else if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-3 md:px-4">
      {isLoading && <Loader />}

      <div className="w-full max-w-md px-5 md:px-8 py-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
        <Toaster />
        <div className="flex justify-center mb-5">
          <Logo />
        </div>

        <h1 className="text-xl font-semibold dark:text-white mb-4 text-center font-roboto">
          Sign In
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="emailOrUsername"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email or Username
            </label>
            <input
              type="text"
              id="emailOrUsername"
              {...register("emailOrUsername")}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              placeholder="Enter your email or username"
              required
            />
            {errors.emailOrUsername && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emailOrUsername.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                {...register("password")}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                placeholder="Enter your password"
                required
              />
              <div
                onClick={togglePasswordVisibility}
                className="absolute cursor-pointer top-[calc(50%-10px)] right-3 flex items-center text-gray-500 dark:text-gray-400"
              >
                {passwordVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message}
              </p>
            )}

            <Link
              href="/forgot-password"
              className="text-blue-500 underline mx-1 mt-1 text-sm font-roboto"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                         hover:from-blue-700 hover:to-purple-700
                         dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600
                         transition-colors duration-200 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Sign In
          </button>

          {showResendBtn && (
            <button
              onClick={onResend}
              type="button"
              className="text-blue-600 underline"
            >
              Resend verification email
            </button>
          )}
        </form>

        <hr className="my-3 mt-6 border-gray-700 dark:border-gray-300" />

        <div className="flex flex-col gap-4">
          <GoogleSignInButton />
          <GitHubSignInButton />
        </div>

        <p className="mt-6 text-center font-inter text-sm text-gray-600 dark:text-gray-400">
          {"Don't have an account? "}
          <Link href="/signup" className="text-indigo-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
