import React, { useEffect, useState } from 'react';
import { X, Eraser, AlertTriangle, LoaderCircle, Router } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { handleResetVault } from '@/lib/user/resetVault';
import { useMasterPass } from '@/context/MasterPassword';
import { useRouter } from 'next/navigation';

export default function ResetVaultModal({ isOpen, onClose, showPasswordInput }) {
  const [confirmationText, setConfirmationText] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const { setMasterPass, setMasterPassSet } = useMasterPass();
  const router = useRouter()

  const handleReset = async () => {
    setIsResetting(true);
    await toast.promise(handleResetVault(confirmationText), {
      loading: 'Resetting...',
      success: (data) => {
        setIsResetting(false);
        onClose();
        router.push("/dashboard")
        setMasterPass(null)
        setMasterPassSet(true)
        return data.message;
      },
      error: (error) => {
        setIsResetting(false);
        return error.message;
      },
    });
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl w-[95%] max-w-md relative border border-gray-200 dark:border-gray-700 text-center">

        {/* Close Button */}
        <X
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 cursor-pointer"
          role="button"
          aria-label="Close modal"
        />

        {/* Warning Icon & Title */}
        <div className="flex flex-col items-center justify-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400 mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">
            Reset Your Vault?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            This action will delete all your saved data.
          </p>
        </div>

        {/* Warning Message */}
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          <span className="font-bold text-red-600 dark:text-red-400">Warning:</span> All your saved entries <span className="font-bold text-red-600 dark:text-red-400">including your master password</span> will be <span className="font-bold text-red-600 dark:text-red-400">permanently deleted</span>. This action <span className="font-bold text-red-600 dark:text-red-400">cannot be undone</span>.
        </p>

        {/* Confirmation Input */}
        {showPasswordInput && <div className="relative group mb-6 text-left">
          <label
            htmlFor="confirm-reset"
            className="px-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            Enter your password to confirm
          </label>
          <input
            id="confirm-reset"
            type="password"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && confirmationText.trim()) {
                handleReset();
              }
            }}
            placeholder=" "
            className="peer w-full px-4 py-2.5 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-transparent outline-none focus:border-red-500 dark:focus:border-red-400 transition duration-200 text-lg"
          />
        </div>}

        {/* Action Buttons */}
        <div className="flex gap-4 md:mt-8 flex-col-reverse md:flex-row">
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center p-3 rounded-2xl shadow-lg bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleReset}
            disabled={isResetting || (showPasswordInput && !confirmationText.trim())}
            className="flex-1 inline-flex items-center justify-center p-3 rounded-2xl shadow-lg bg-red-600 text-white font-bold md:text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isResetting ? (
              <>
                <LoaderCircle className="w-5 h-5 mr-2 animate-spin" /> Resetting...
              </>
            ) : (
              <>
                <Eraser className="w-5 h-5 mr-2" /> Reset Vault
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
