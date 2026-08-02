"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const formatRemaining = (ms) => {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${s}s`;
};

export default function BlockedAccount({ retryAfterMs = 0 }) {
  const [remaining, setRemaining] = useState(retryAfterMs);

  useEffect(() => {
    if (!remaining) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span>
      Your vault is temporarily locked due to too many invalid attempts. It
      unlocks in {formatRemaining(remaining)}.{" "}
      <Link href="/blocked-accounts-help" className="underline text-blue-500">
        Learn more
      </Link>
    </span>
  );
}
