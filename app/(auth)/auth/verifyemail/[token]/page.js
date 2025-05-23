"use client";
import Logo from "@/components/logo";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function VerifyEmailPage() {
  const [message, setMessage] = useState({});
  const [isverifying, setIsverifying] = useState(false);
  const params = useParams();
  const router = useRouter();
  const handleVerify = async () => {
    const { token } = params;
    try {
      setIsverifying(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verifyemail/${token}`
      );

      if (res.status === 200) {
        setMessage({ message: res.data.message, isVerified: true });
        const redirect = new Promise((res) => {
          setTimeout(() => {
            router.push("/sign-in");
            res("Redirected");
          }, 3000);
        });
        await toast.promise(redirect, {
          loading: "Redirecting to SignIn",
          success: (data) => data,
          error: "Something went wrong",
        });
      }
    } catch (err) {
      console.log(err);
      if (err)
        setMessage({
          message:
            err.response.data.message || err.message || "Unable to verify you",
          isVerified: false,
        });
    } finally {
      setIsverifying(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div>
          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Click the button below to verify your account.
          </p>
          {message.message && (
            <p
              className={`mt-2 text-center font-inter font-semibold text-sm ${
                !message.isVerified ? "text-red-500" : "text-green-600"
              }`}
            >
              {message.message}
            </p>
          )}
        </div>
        <div className="rounded-md shadow">
          <button
            type="button"
            onClick={handleVerify}
            disabled={isverifying || message.isVerified}
            className="group relative w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white
                         hover:from-blue-700 hover:to-purple-700
                         dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600
                         transition-all duration-200 flex justify-center items-center h-8"
          >
            {isverifying ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              "Verify Email"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
