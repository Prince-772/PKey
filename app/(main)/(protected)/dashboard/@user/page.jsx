"use client"
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader/loader2";

export default function User() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-start pt-5 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {(status === "loading" )? (
        <Loader text="Loading User Info..." color="blue" />
      ) : null}
    </div>
  );
}