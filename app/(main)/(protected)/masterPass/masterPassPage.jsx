"use client"
import { useMasterPass } from '@/context/MasterPassword';
import { VerifyMasterPass } from '@/lib/masterpassword/verify';
import { KeyRound } from 'lucide-react'; // Icons
import { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams, useRouter } from 'next/navigation';


export default function MasterPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const {setMasterPass} = useMasterPass()
  const mPass = useRef(null)

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callback');

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mPass.current?.value) {
      setIsLoading(true)
      await toast.promise(VerifyMasterPass(mPass.current.value), {
        loading: "Verifying...",
        success: () => {
          setMasterPass(mPass.current.value)
          mPass.current.value = ""
          setIsLoading(false)
          if (callbackUrl === "vault") router.replace("/vault")
          else router.replace("/dashboard")
          return "Vault unlocked!"
        },
        error: (err) => {
          setMasterPass(null) // remove existing mPass for wrong attempts
          mPass.current.value = ""
          setIsLoading(false)
          return err.message
        }
      })
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-4">
      <Toaster />
      <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md relative
                      border border-gray-200 dark:border-gray-700 text-center">

        <div className="flex flex-col items-center justify-center mb-8">
          <KeyRound className="w-16 h-16 text-blue-600 dark:text-blue-400 mb-4" />
          <h1 className="text-3xl md:text-4xl font-extrabold
                         bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Access Your Vault
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your master password to unlock your saved credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative group">
            <label
              htmlFor="master-password-input"
              className="absolute -top-3 left-4 px-2 text-sm font-medium
                         bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                         transform transition-all duration-200 ease-in-out
                         group-focus-within:top-[-0.75rem] group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400
                         peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500"
            >
              Master Password
            </label>
            <input
              id="master-password-input"
              type="password"
              placeholder=" "
              required
              ref={mPass}
              className="peer w-full px-4 py-2.5 border-2 rounded-lg
                         bg-gray-50 dark:bg-gray-700
                         border-gray-300 dark:border-gray-600
                         text-gray-900 dark:text-gray-100
                         placeholder-transparent outline-none
                         focus:border-blue-500 dark:focus:border-blue-400
                         transition duration-200 text-lg pr-10"
              aria-label="Master Password"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full shadow-lg
                       bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg
                       hover:from-blue-700 hover:to-purple-700
                       focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-200
                       transition-all duration-300 ease-in-out transform hover:-translate-y-1
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <KeyRound className="w-5 h-5 mr-2 animate-bounce" /> Unlocking...
              </>
            ) : (
              'Unlock Vault'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}