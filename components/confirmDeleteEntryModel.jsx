import React, { useEffect, useState } from 'react';
import { X, Trash2, LoaderCircle } from 'lucide-react'; // Icons for warning, delete, and loading
import { handleDeletePassword } from '@/lib/passwords/deletePassword';
import toast from 'react-hot-toast';

export default function DeleteEntryModal({ onClose, callback, id, resetID }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await toast.promise(handleDeletePassword(id), {
      loading: "Please wait...",
      success: (data) => {
        setIsDeleting(false)
        callback()
        resetID()
        onClose()
        return data.message || "Entry Deleted!"
      },
      error: (err) => {
        setIsDeleting(false)
        return err.message || "Something went wrong!"
      }
    })
  }
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => document.body.style.overflow = 'auto'
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-2xl w-[95%] max-w-md relative
                      border border-gray-200 dark:border-gray-700 text-center animate-scaleIn">

        {/* Close Button */}
        <X
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 text-gray-500 dark:text-gray-400
                     hover:text-red-600 dark:hover:text-red-400
                     transition-colors duration-200 cursor-pointer"
          role="button"
          aria-label="Close modal"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
        />

        {/* Warning Icon & Title */}
        <div className="flex flex-col items-center justify-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <Trash2 className="w-16 h-16 text-red-600 dark:text-red-400 mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-center text-red-600 dark:text-red-400">
            Are you sure want to delete this entry?
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 md:gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full shadow-lg
                       bg-gray-300 text-gray-800
                       hover:bg-gray-400
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                       dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
                       transition-all duration-300 ease-in-out text-sm font-semibold
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center px-3 md:px-6 py-3 rounded-full shadow-lg
                       bg-red-600 text-white font-bold text-sm text-nowrap
                       hover:bg-red-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                       dark:bg-red-500 dark:hover:bg-red-600
                       transition-all duration-300 ease-in-out transform hover:-translate-y-1
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="w-5 h-5 mr-2 shrink-0 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5 mr-2 shrink-0 " /> Delete Entry
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
