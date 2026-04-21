"use client";
import { useMasterPass } from "@/context/MasterPassword";
import { VerifyMasterPass } from "@/lib/masterpassword/verify";
import { KeyRound, ShieldCheck, X } from "lucide-react"; // Icons
import Link from "next/link";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { generateAuthData } from "@/lib/masterpassword/mPasscryptoV3";
import { AutoMigrateToUv2 } from "@/lib/masterpassword/migrationtov2/migrate";

export default function MasterPasswordModel({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const { setMasterPass, setEncKey } = useMasterPass();
  const mPass = useRef(null);
  const { data: session, update } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mPassValue = mPass.current?.value;
    if (mPassValue) {
      setIsLoading(true);
      const version = session?.user?.version;

      let authHash, encryptionKey, salt;
      if (version > 1) {
        salt = session?.user?.salt;
        ({ authHash, encryptionKey } = await generateAuthData(mPassValue, salt));
      } else if (version === 1) {
        authHash = mPassValue;
        ({ salt, encryptionKey } = await generateAuthData(mPassValue));
      }

      await toast.promise(VerifyMasterPass(authHash), {
        loading: "Verifying...",
        success: async () => {
          mPass.current.value = "";
          setIsLoading(false);
          setEncKey(encryptionKey);

          if (version === 1) {
            setMasterPass(mPassValue); // raw mPass is still required for Uv1 users
            // generate New Zero-Knowldege Data
            const { authHash: newHash } = await generateAuthData(mPassValue, salt);
            try {
              const response = await AutoMigrateToUv2(newHash, salt);
              if (response.success) {
                await update({
                  ...session,
                  user: {
                    ...session.user,
                    version: 2,
                    salt,
                  },
                });
              }
              return "Security Upgraded & Vault Unlocked!";
            } catch (err) {
              return "Vault Unlocked (Security upgrade failed)";
            }
          } else if (version === 2) {
            setMasterPass(mPassValue); // raw mPass is still required for Uv2 users as we don't know if all the entries are migrated or not.
          }
          // No need of raw mPass value for Uv3 users as Uv3 ensures each entry is migrated to Dv3.
          return "Vault Unlocked!";
        },
        error: (err) => {
          setMasterPass(null);
          setEncKey(null);
          mPass.current.value = "";
          setIsLoading(false);

          if (err.message === "BLOCKED_ACCOUNT") {
            return (
              <span>
                Your account is blocked due to too many invalid attempts.{" "}
                <Link
                  href="/blocked-accounts-help"
                  className="underline text-blue-500"
                >
                  Learn what to do
                </Link>
              </span>
            );
          } else {
            return err.message || "Something went wrong";
          }
        },
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-gray-950/70 dark:bg-black/80 backdrop-blur-md overflow-auto scroll-bar-hide">
      <div
        className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-[95%] max-w-md max-h-[95vh] animate-scale-in border-3 border-gray-200 dark:border-gray-700 overflow-auto scroll-bar-hide my-auto"
      >
        <X
          className="absolute top-5 right-5 cursor-pointer hover:text-red-500"
          onClick={onClose}
        />
        <div className="flex flex-col items-center justify-center mb-8">
          <KeyRound className="w-16 h-16 text-blue-600 dark:text-blue-400 mb-4" />
          <h1
            className="text-3xl md:text-4xl font-extrabold
                         bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          >
            Access Your Vault
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your master password to unlock your saved credentials.
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link
              onClick={onClose}
              href="/dashboard"
              className="text-blue-500 underline"
            >
              create one
            </Link>{" "}
            if you haven't done so yet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="group text-left">
            <label
              htmlFor="master-password-input"
              className="pl-1 text-sm font-medium flex items-center gap-1
                         bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                         transform transition-all duration-300 ease-in-out
                         group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 mb-1"
            >
              <ShieldCheck className="w-4 h-4 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />Master Password
            </label>
            <input
              id="master-password-input"
              type="password"
              required
              ref={mPass}
              className="peer w-full px-4 py-2.5 border-2 rounded-lg
                         bg-gray-50 dark:bg-gray-700
                         border-gray-300 dark:border-gray-600
                         text-gray-900 dark:text-gray-100 outline-none
                         focus:border-blue-500 dark:focus:border-blue-400
                         transition duration-300 text-lg pr-10"
              aria-label="Master Password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full shadow-lg
                       bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-lg
                       hover:from-blue-700 hover:to-purple-700
                       focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-200
                       transition-all duration-300 ease-in-out transform hover:-translate-y-1
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <KeyRound className="w-5 h-5 mr-2 animate-bounce" />{" "}
                Unlocking Securily...
              </>
            ) : (
              "Unlock Vault"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
