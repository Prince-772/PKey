"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { HandleSignUp } from "@/lib/auth/handleSign-up";
import { getPasswordStrength } from "@/lib/helper";

import toast from "react-hot-toast";
import Logo from "@/components/logo";
const schema = z
  .object({
    name: z.string().min(3, "Name must contain at least 3 characters"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => {
    const {realScore} = getPasswordStrength(data.password);
    return realScore >= 2;
  }, {
    message: "Password is too weak.",
    path: ["password"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const getStrengthColor = (score) => {
  if (score === 0) return "bg-red-500";
  if (score === 1) return "bg-orange-500";
  if (score === 2) return "bg-yellow-500";
  if (score === 3) return "bg-blue-500";
  if (score === 4) return "bg-green-500";
  return "bg-gray-200";
};

const getTextColor = (score) => {
  if (score === 0) return "text-red-500";
  if (score === 1) return "text-orange-500";
  if (score === 2) return "text-yellow-500";
  if (score === 3) return "text-blue-500";
  if (score === 4) return "text-green-500";
  return "text-gray-500";
};

export default function SignupPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const passwordValue = watch("password", "");
  const strength = getPasswordStrength(passwordValue);

  const onSubmitHandler = handleSubmit(async (data) => {
    try {
      await toast.promise(HandleSignUp(data), {
        loading: "Signing up...",
        success: <b>Signed up successfully!</b>,
        error: (err) => {console.log(err, "dfdafd"); return <b>{err.message || "Sign-up failed"}</b>},
      });

      // Only runs if sign-up was successful
      toast.success("Verification email sent! Please check your inbox.", {
        style: {
          border: "1px solid #4ade80",
          padding: "10px",
          color: "#166534",
        },
        icon: "📧",
      });
      // reset();
      // router.push("/sign-in");
    } catch (error) {}
  });

  return (
    <div className="min-h-screen flex py-4 items-center justify-center bg-gray-100 dark:bg-gray-900 px-3 md:px-4">
      {/* {loading && <Loader />} */}
      <div className="w-full max-w-md px-5 md:px-8 py-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
        <div className="flex justify-center mb-5">
          <Logo />
        </div>

        <h1 className="text-xl font-semibold dark:text-white mb-4 text-center">
          Sign Up
        </h1>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              placeholder="Enter your Name"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
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
            {passwordValue && passwordValue.length > 0 && (
              <div className="mt-2">
                {/* Thin Progress Bar */}
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor(
                      strength.realScore,
                    )} transition-all duration-300`}
                    style={{ width: `${Math.max(strength.score, 2)}%` }} // Minimum 2% width so it's visible when typing starts
                  ></div>
                </div>
                {/* Score Text & Category */}
                <div className="flex justify-between items-center mt-1 text-xs">
                  <span
                    className={`font-medium ${getTextColor(
                      strength.realScore,
                    )}`}
                  >
                    {strength.category}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {strength.score}%
                  </span>
                </div>
              </div>
            )}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                {...register("confirmPassword")}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                placeholder="Confirm your password"
                required
              />
              <div
                onClick={toggleConfirmPasswordVisibility}
                className="absolute cursor-pointer top-[calc(50%-10px)] right-3 flex items-center text-gray-500 dark:text-gray-400"
              >
                {confirmPasswordVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-linear-to-r from-blue-600 to-purple-600 text-white
                         hover:from-blue-700 hover:to-purple-700
                         dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600
                         transition-colors duration-300 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 font-inter text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-indigo-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
