import { Unlock } from 'lucide-react'
import React from 'react'

const VaultIsLocked = ({ onUnLoack }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto text-center p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">
        Vault Locked 🔐
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Your vault is currently locked for security. Enter your master password to unlock and access your saved data.
      </p>
      <button
        onClick={onUnLoack}
        className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full shadow-lg
                bg-gradient-to-r from-blue-600 to-purple-600 text-white
                hover:from-blue-700 hover:to-purple-700
                dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600
                transition-all duration-300 ease-in-out text-base md:text-lg font-bold transform hover:-translate-y-1"
      >
        <Unlock className="w-5 h-5" /> Unlock Vault
      </button>
    </div>
  )
}

export default VaultIsLocked
