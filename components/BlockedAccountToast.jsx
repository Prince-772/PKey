"use client";

import Link from "next/link";

export default function BlockedAccount() {
  return (
    <span>
      Your account is blocked due to too many invalid attempts.{" "}
      <Link href="/blocked-accounts-help" className="underline text-blue-500">
        Learn what to do
      </Link>
    </span>
  );
}
