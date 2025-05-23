"use client"
import SuggestPassword from "@/lib/passwords/suggestPassword";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast'
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LockKeyhole,
  Shield,
  ShieldCheck,
  TriangleAlert,
  UserPen,
} from "lucide-react";
import React, { useState, } from "react";
import { handleSavePassword } from "@/lib/passwords/submitPasswords";
import { useMasterPass } from "@/context/MasterPassword";
import { encrypt } from "@/lib/passwords/encryptPassword";
import categorizePassword from "@/lib/passwords/strengthChecker";

const CreatePassword = () => {
  const [seePassword, setseePassword] = useState(false);
  const [isPassSuggested, setIsPassSuggested] = useState(false)
  const { masterPass, resetTimer } = useMasterPass()
  const {
    register,
    formState: { errors },
    handleSubmit,
    isSubmiting,
    setValue,
    reset,
  } = useForm();

  const router = useRouter()
  const handleSeePassword = () => {
    setseePassword((prev) => !prev);
  };

  const HandleSuggestStrongPassword = () => {
    const password = SuggestPassword()
    if (password) {
      setValue("password", password, { shouldValidate: true });
      setIsPassSuggested(true)
      setTimeout(() => {
        setIsPassSuggested(false)
      }, 2000);
    }
  }

  const handleOnSubmit = async (formData) => {
    if (!masterPass) return router.push("/masterPass?callback=dashboard")

    // encrypting in client side
    const encryptedPass = encrypt(formData.password, masterPass)
    console.log(encryptedPass);
    const strength = categorizePassword(formData.password)
    await toast.promise(handleSavePassword({ ...formData, password: encryptedPass, strength }), {
      loading: "Saving...",
      success: ({ message }) => {
        resetTimer()
        return message || "Saved Successfully!"
      },
      error: ({ message }) => message || "Something went wrong"
    })
    reset({ password: "" });
  }
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="rounded-lg shadow-xl px-5 py-8 w-full max-w-2xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-lg md:text-xl font-inter font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Create New Password Entry
        </h1>

        <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-6">
          {/* Site Name Input */}
          <div className="group">
            <label
              htmlFor="site"
              className="px-2 text-sm font-medium
                       text-gray-700 dark:text-gray-300
                       transform transition-all duration-200 ease-in-out
                       group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400
                       flex items-center gap-1 mb-1"
            >
              <Globe className="w-4 h-4" /> Site Name
            </label>
            <input
              type="text"
              placeholder=" "
              {...register("site", { required: "Site name is required" })}
              className="peer w-full h-12 px-4 border-2 rounded-lg
                       bg-gray-50 dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       text-gray-900 dark:text-gray-100
                       placeholder-transparent outline-none
                       focus:border-blue-500 dark:focus:border-blue-400
                       transition duration-200 text-lg"
              name="site"
              id="site"
              autoComplete="off"
            />
            {errors.site && (
              <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
                <TriangleAlert className="w-4 h-4" />
                {errors.site.message}
              </p>
            )}
          </div>

          {/* Username Input */}
          <div className="group">
            <label
              htmlFor="username"
              className="px-2 text-sm font-medium
                       text-gray-700 dark:text-gray-300
                       transform transition-all duration-200 ease-in-out
                       group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400
                       flex items-center gap-1 mb-1"
            >
              <UserPen className="w-4 h-4" /> Username
            </label>
            <input
              type="text"
              placeholder=" " // Important for the floating label effect
              {...register("username", { required: "Username is required" })}
              className="peer w-full h-12 px-4 border-2 rounded-lg
                       bg-gray-50 dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       text-gray-900 dark:text-gray-100
                       placeholder-transparent outline-none
                       focus:border-blue-500 dark:focus:border-blue-400
                       transition duration-200 text-lg"
              name="username"
              id="username"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
                <TriangleAlert className="w-4 h-4" />
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Input & Suggest Button */}
          <div className="group">
            <label
              htmlFor="password"
              className="px-2 text-sm font-medium
                         text-gray-700 dark:text-gray-300
                         transform transition-all duration-200 ease-in-out
                         group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400
                         flex items-center gap-1 mb-1"
            >
              <KeyRound className="w-4 h-4" /> Password
            </label>
            <div className="relative flex flex-col md:flex-row gap-4">
              <input
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be alteast 6 characters long" } })}
                type={seePassword ? "text" : "password"}
                placeholder=" "
                className="peer w-full h-12 px-4 border-2 rounded-lg
                             bg-gray-50 dark:bg-gray-700
                             border-gray-300 dark:border-gray-600
                             text-gray-900 dark:text-gray-100
                             placeholder-transparent outline-none
                             focus:border-blue-500 dark:focus:border-blue-400
                             transition duration-200 text-lg font-mono"
                id="password"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <div
                onClick={handleSeePassword}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer
                         text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200"
              >
                {seePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1 md:flex">
                <TriangleAlert className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}

            <div className="flex items-center mt-3">
              <button
                type="button"
                onClick={HandleSuggestStrongPassword}
                disabled={isPassSuggested}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md shadow-md
                         ${isPassSuggested
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
                  }
                         transition-all duration-300 ease-in-out text-sm md:text-base font-semibold
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {isPassSuggested ? (
                  <ShieldCheck className={`w-5 h-5 ${isPassSuggested ? "text-gray-500 dark:text-gray-400" : ""}`} />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
                Suggest Strong Password
              </button>
            </div>
          </div>

          {/* Save Password Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmiting}
              className={`cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full shadow-lg
                       bg-gradient-to-r from-teal-500 to-emerald-600 text-white
                       hover:from-teal-600 hover:to-emerald-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
                       dark:from-teal-400 dark:to-emerald-500 dark:hover:from-teal-500 dark:hover:to-emerald-600
                       transition-all duration-300 ease-in-out text-lg font-bold
                       ${isSubmiting ? "opacity-70 cursor-not-allowed" : "transform hover:-translate-y-1"}
                      `}
            >

              <LockKeyhole className="w-5 h-5" />
              Save Password
              <CheckCircle2 className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
