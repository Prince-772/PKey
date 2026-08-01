"use client";
import { Suspense } from "react";
import SecurityTab from "@/components/dashboard/SecurityTab";

const Page = () => {
  return (
    <Suspense fallback={null}>
      <SecurityTab />
    </Suspense>
  );
};

export default Page;
