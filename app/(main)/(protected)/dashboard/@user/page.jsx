"use client"
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader/loader2";

export default function User() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-start pt-5 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {(status === "loading" )? (
        <Loader text="Loading User Info..." color="blue" />
      ) : (
        <div className="w-full max-w-4xl">
            <div className="flex gap-1 md:gap-2 justify-center text-2xl md:text-4xl font-bold flex-wrap">
              <span className="text-gray-900 dark:text-gray-50">Welcome,</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-nowrap">
                {session?.user?.name || "PKey User"}!
              </span>
            </div>
        </div>
      )}
    </div>
  );
}