
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast'; // For notifications
import { X, KeyRound, CheckCircle2, LoaderCircle } from 'lucide-react'; // Icons
import zxcvbn from 'zxcvbn';

const getPasswordStrength = (password) => {
  const result = zxcvbn(password);
  const score = result.score; // 0 to 4

  switch (score) {
    case 4: return 'Very Strong';
    case 3: return 'Strong';
    case 2: return 'Medium';
    case 1: return 'Weak';
    default: return 'Very Weak';
  }
};


export default function CreateMasterPasswordModal({ isOpen, onClose, onSetMasterPassword }) {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const masterPasswordValue = watch('masterPassword', '');
  const passwordStrength = getPasswordStrength(masterPasswordValue);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSetMasterPassword(data.masterPassword)
    reset()
    onClose()
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 dark:bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-2xl w-[95%] max-w-md relative animate-scaleIn border border-gray-200 dark:border-gray-700">

        <X onClick={onClose} className="absolute top-4 right-4 w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer" />

        <div className="text-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <KeyRound className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-3 mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Set Your Master Password</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">This password unlocks your credentials. If forgotten, you will have to reset your vault. It cannot be recovered.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className='w-full'>
            <input
              type="password"
              placeholder="Master Password"
              {...register("masterPassword", {
                required: "Master password is required",
                minLength: { value: 8, message: "At least 8 characters" },
              })}
              className="px-4 py-3 rounded-lg border-2 bg-gray-50 w-full dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 outline-none text-lg"
            />
            {errors.masterPassword && <p className="text-red-600 text-sm ml-1 font-roboto">{errors.masterPassword.message}</p>}

            {masterPasswordValue && (
              <p className="text-sm font-roboto font-semibold text-left">
                <span className="text-gray-600 dark:text-gray-400">Strength: </span>
                <span className={{
                  'Very Strong': 'text-emerald-600',
                  'Strong': 'text-blue-600',
                  'Medium': 'text-orange-500',
                  'Weak': 'text-red-600',
                  'Very Weak': 'text-red-800'
                }[passwordStrength]}
                >{passwordStrength}</span>
              </p>
            )}</div>

          <div className='w-full'>
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: val => val === masterPasswordValue || "Passwords do not match",
            })}
            className="w-full px-4 py-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 outline-none text-lg"
          />
          {errors.confirmPassword && <p className="text-red-600 font-roboto ml-1 text-sm">{errors.confirmPassword.message}</p>}

          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed flex gap-2 justify-center items-center"
          >
            {isSubmitting ? <><LoaderCircle className="w-5 h-5 mr-2 animate-spin" /> Setting...</> : <><CheckCircle2 className="w-5 h-5 mr-2" /> Set Password</>}
          </button>
        </form>

        <style jsx>{`
          @keyframes scaleIn {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );

}
