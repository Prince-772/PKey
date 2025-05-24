import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, Trash2, LoaderCircle } from 'lucide-react'; // Icons for warning, delete, and loading
import { Toaster, toast } from 'react-hot-toast'; // For notifications
import { handleDeleteAccount } from '@/lib/user/deleteAccount';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
export default function DeleteAccountModal({ isOpen, onClose, showPasswordInput }) {

  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    await toast.promise(handleDeleteAccount(confirmationText), {
      loading: 'Deleting...',
      success: async (data) => {
        await signOut({ redirect: false })
        router.push('/')
        setIsDeleting(false)
        onClose()
        return data.message
      },
      error: ({ message }) => {
        setIsDeleting(false)
        if (message === "BLOCKED_ACCOUNT") {
          return (
            <span>
              Your account is blocked due to too many invalid attempts.{" "}
              <Link href="/blocked-accounts-help" className="underline text-blue-500">
                Learn what to do
              </Link>
            </span>
          );
        } else {
          return message || "Something went wrong";
        }
      }
    })
  };

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => document.body.style.overflow = "auto"
  }, [])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-in-out">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl w-[95%] max-w-md relative
                      border border-gray-200 dark:border-gray-700 text-center animate-scaleIn">

        {/* Close Button */}
        <X
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 text-gray-500 dark:text-gray-400
                     hover:text-red-600 dark:hover:text-red-400
                     transition-colors duration-200 cursor-pointer"
          role="button"
          aria-label="Close modal"
        />

        {/* Warning Icon & Title */}
        <div className="flex flex-col items-center justify-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400 mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-center text-red-600 dark:text-red-400">
            Delete Your Account?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            This action is irreversible.
          </p>
        </div>

        {/* Warning Message */}
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          <span className="font-bold text-red-600 dark:text-red-400">Warning:</span> All your saved passwords and account data will be <span className="font-bold text-red-600 dark:text-red-400">permanently deleted</span>. This action <span className="font-bold text-red-600 dark:text-red-400">cannot be undone</span> and your account cannot be recovered.
        </p>

        {/* Confirmation Input */}
        {showPasswordInput && <div className="relative group mb-6 text-left">
          <label
            htmlFor="confirm-delete"
            className="px-2 text-sm font-medium
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                       transform transition-all duration-200 ease-in-out">
            Enter Your password to confirm
          </label>
          <input
            id="confirm-delete"
            type="password"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && confirmationText.trim()) {
                handleDelete();
              }
            }}
            placeholder=" "
            className="peer w-full px-4 py-2.5 border-2 rounded-lg
                       bg-gray-50 dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       text-gray-900 dark:text-gray-100
                       placeholder-transparent outline-none
                       focus:border-red-500 dark:focus:border-red-400
                       transition duration-200 text-lg"
          />
        </div>}

        {/* Action Buttons */}
        <div className="flex gap-4 md:mt-8 flex-col-reverse md:flex-row">
          <button
            onClick={onClose}
            className="text-nowrap flex-1 inline-flex items-center justify-center p-3 rounded-2xl shadow-lg
                       bg-gray-300 text-gray-800
                       hover:bg-gray-400
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                       dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
                       transition-all duration-300 ease-in-out text-base font-semibold
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || (showPasswordInput && !confirmationText.trim())}
            className="text-nowrap flex-1 inline-flex items-center justify-center p-3 rounded-2xl shadow-lg
                       bg-red-600 text-white font-bold md:text-lg
                       hover:bg-red-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                       dark:bg-red-500 dark:hover:bg-red-600
                       transition-all duration-300 ease-in-out transform hover:-translate-y-1
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="w-5 h-5 mr-2 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5 mr-2" /> Delete Account
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
