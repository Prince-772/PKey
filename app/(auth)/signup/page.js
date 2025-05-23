"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GoogleSignInButton, GitHubSignInButton,EmailSignUpButton } from "@/components/buttons.jsx";
import Logo from "@/components/logo";

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-3 md:px-4">
      {/* {loading && <Loader />} */}
      <div className="w-full max-w-md px-5 md:px-8 py-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
        <div className="flex justify-center mb-5">
          <Logo />
        </div>

        <h1 className="text-xl font-semibold dark:text-white mb-6 text-center">
          Sign Up
        </h1>

        <div className="flex flex-col gap-4">
          <EmailSignUpButton />
          <hr />
          <GoogleSignInButton />
          <GitHubSignInButton />

        </div>

        <p className="mt-6 font-inter text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-indigo-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
