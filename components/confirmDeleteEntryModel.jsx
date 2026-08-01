"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, LoaderCircle, ShieldAlert, User } from "lucide-react";
import { handleDeletePassword } from "@/lib/passwords/deletePassword";
import { handleDeletePasscode } from "@/lib/passcodes/deletePasscode";
import toast from "react-hot-toast";

export default function DeleteEntryModal({ onClose, callback, resetID, data }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { id, siteName, usernames = [], type = "password" } = data;

  const handleDelete = async () => {
    setIsDeleting(true);
    const deleteFn =
      type === "passcode" ? handleDeletePasscode : handleDeletePassword;
    await toast.promise(deleteFn(id), {
      loading: "Deleting...",
      success: (data) => {
        setIsDeleting(false);
        callback?.();
        resetID?.();
        onClose();
        return data.message || "Entry Deleted!";
      },
      error: (err) => {
        setIsDeleting(false);
        return err.message || "Something went wrong!";
      },
    });
  };

  const visibleUsernames = usernames.slice(0, 2);
  const extraCount = usernames.length - 2;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center sm:items-center justify-center p-4 bg-gray-950/70 dark:bg-black/80 backdrop-blur-md">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Panel */}
      <div className="relative max-h-[95vh] z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-y-auto scroll-bar-hide animate-scale-in">
        {/* Red top strip */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-red-500 via-rose-500 to-red-600" />

        {/* Close */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Body */}
        <div className="px-3 md:px-6 pt-8 pb-6 space-y-5">
          {/* Icon + Title */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800/50 flex items-center justify-center text-red-600 dark:text-red-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                Delete this entry?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>

          {/* Entry preview card */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 space-y-3">
            {/* Site */}
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 border border-blue-200/50 dark:border-blue-800/30 flex items-center justify-center text-sm font-black text-blue-600 dark:text-blue-400 uppercase">
                {siteName?.[0] ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Site
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {siteName}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Usernames */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3 text-gray-400" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {usernames.length > 1 ? "Usernames" : "Username"}
                </p>
              </div>
              {visibleUsernames.map((u, i) => (
                <p
                  key={i}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 font-mono truncate pl-1"
                >
                  {u}
                </p>
              ))}
              {extraCount > 0 && (
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 pl-1">
                  +{extraCount} more username{extraCount > 1 ? "s" : ""} / ID
                  {extraCount > 1 ? "s" : ""} attached
                </p>
              )}
            </div>
          </div>

          {/* Warning note */}
          <div className="flex text-xs font-medium text-red-700 dark:text-red-300 items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40">
            <Trash2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="overflow-hidden">
              <p className=" leading-snug">
                All usernames, passwords, and associated data for
              </p>
              <p className="font-black truncate">{siteName}</p>
              <p>will be permanently erased from your vault.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-3 md:px-6 pb-6 flex-wrap-reverse">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-5 py-3 rounded-xl min-w-1/2 font-bold text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black  text-nowrap text-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin shrink-0" />{" "}
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 shrink-0" /> Delete Entry
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
