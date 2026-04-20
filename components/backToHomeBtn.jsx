import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackToHomeBtn({extClassName}) {
  return (
    <div className={`flex justify-center items-center ${extClassName}`}>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all border-2 p-3 rounded-full duration-300"
      >
        <ArrowLeft className="w-5 h-5 shrink-0" /> Back to Home
      </Link>
    </div>
  );
}
