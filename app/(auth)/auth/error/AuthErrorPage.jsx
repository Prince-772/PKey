"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-700 mb-6">
          {error
            ? decodeURIComponent(error).replace(/_/g, " ")
            : "Something went wrong during login."}
        </p>
        <button
          onClick={() => router.push("/sign-in")}
          className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Go Back to Sign In
        </button>
      </div>
    </div>
  );
}
