import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

const imageSize = 30

export function GitHubSignInButton() {
  const handleSignInWithGithub = async () => {
    signIn("github", { callbackUrl: "/dashboard" })
  }
  return (
    <button
      type="button"
      onClick={handleSignInWithGithub}
      className="flex items-center justify-center w-full gap-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#24292f] px-4 py-1.5 cursor-pointer text-gray-800 dark:text-white transition-colors duration-200 shadow-sm hover:bg-gray-100 dark:hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
    >
      <Image
        width={imageSize}
        height={imageSize}
        src="/images/github.svg"
        alt="GitHub logo"
      />
      <span className="font-medium">Sign In with GitHub</span>
    </button>
  );
}

export function GoogleSignInButton() {
  const handleSignInWithGoogle = async () => {
    signIn("google", { callbackUrl: "/dashboard" });
  }
  return (
    <button
      onClick={handleSignInWithGoogle}
      type="button"
      className="flex items-center justify-center w-full gap-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 px-4 py-1.5 cursor-pointer text-gray-800 dark:text-gray-100 transition-colors duration-200 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
    >
      <Image
        height={imageSize}
        width={imageSize}
        src="/images/google.svg"
        alt="Google logo"
      />
      <span className="font-medium">Sign In with Google</span>
    </button>
  );
}


export function EmailSignUpButton() {
  return (
    <Link
      className="flex items-center justify-center w-full gap-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 px-4 py-1.5 cursor-pointer text-gray-800 dark:text-gray-100 transition-colors duration-200 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
      href="/signup/email">
      <Image
        src="/images/mail.svg"
        alt="Email icon"
        width={imageSize}
        height={imageSize}
        className="object-contain"
      />
      <span className="font-medium">Sign Up with Email</span>
    </Link>
  );
}