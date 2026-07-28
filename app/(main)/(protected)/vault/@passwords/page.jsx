"use client";
import PasswordCard from "@/components/passwordCard";
import EditModal from "@/components/editPasswordModel";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader/loader2";
import {
  handleEditPassword,
  handleToggleFavorite,
} from "@/lib/passwords/editpasswords";
import toast from "react-hot-toast";
import { useMasterPass } from "@/context/MasterPassword";
import { decrypt } from "@/lib/passwords/oldencryptPassword"; // It is being imported only for old user to updgrade their account
import MasterPasswordModel from "@/components/MasterPasswordModal";
import EmptyVault from "@/components/emptyVaultMsg";
import VaultIsLocked from "@/components/lockVaultMessage";
import DeleteEntryModal from "@/components/confirmDeleteEntryModel";
import { ShieldCheck, SlidersHorizontal, Search, Cross, X } from "lucide-react";
import NoMatchFound from "@/components/noMatchFound";
import { UpdateToDV3 } from "@/lib/passwords/updatetonew/updatetonew";
import { decryptV3, encryptV3 } from "@/lib/passwords/encryptPassV3";
import { useSession } from "next-auth/react";
import ScrollReveal from "@/components/ScrollReveal";
import BlockedAccount from "@/components/BlockedAccountToast";
import { usePasswords } from "@/context/PasswordsProvider";

const Passwords = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingData, setEditingData] = useState({
    usernames: [""],
    platform: "",
    password: "",
    id: "",
    version: 0,
  });

  const { masterPass, encKey, resetTimer } = useMasterPass();
  const { loading, passwords, fetchPasswords } = usePasswords();
  const [showMasterPassModel, setShowMasterPassModel] = useState(false);
  const [showConfirmDeleteEntryModel, setshowConfirmDeleteEntryModel] =
    useState(false);
  const [deleteEntryData, setDeleteEntryData] = useState({id:null, siteName:"", usernames:[]});
  // const { data: session, update } = useSession();

  const handleEdit = useCallback(
    (data) => {
      if (!encKey) return setShowMasterPassModel(true);
      setEditingData(data);
      setIsEditOpen(true);
      resetTimer();
    },
    [masterPass, encKey, resetTimer],
  );

  const onToggleFavorite = useCallback(
    async ({idToToggle, value, onError}) => {
      if (!encKey) return setShowMasterPassModel(true);
      const newFavStatus = value;
      await toast.promise(handleToggleFavorite(idToToggle, newFavStatus), {
        loading: "Please wait...",
        success: (res) => {
          resetTimer();
          return res.message || "Changes saved!";
        },
        error: ({ message }) => {
          onError(!value)
          if (message === "BLOCKED_ACCOUNT") {
            return <BlockedAccount />;
          } else {
            return message || "Something went wrong";
          }
        },
      });
    },
    [passwords, masterPass, encKey, resetTimer],
  );

  const handleDelete = useCallback(
    async (data) => {
      if (!encKey) return setShowMasterPassModel(true);
      setDeleteEntryData(data);
      setshowConfirmDeleteEntryModel(true);
    },
    [masterPass, encKey],
  );

  const onSaveChanges = useCallback(
    (data) => {
      if (!encKey) return setShowMasterPassModel(true);
      toast.promise(handleEditPassword(data), {
        loading: "Saving...",
        success: (res) => {
          fetchPasswords();
          return res.message || "Changes saved!";
        },
        error: ({ message }) => {
          if (message === "BLOCKED_ACCOUNT") {
            return <BlockedAccount />;
          } else {
            return message || "Something went wrong";
          }
        },
      });
    },
    [masterPass, encKey],
  );

  // useEffect(() => {
  //   fetchPasswords();
  //   return () => setShowMasterPassModel(false);
  // }, [masterPass, encKey]);

  const [selectedOpt, setSelectedOpt] = useState(["all"]);
  const [searchTerms, setsearchTerms] = useState("");
  const filterOptArray = [
    "All",
    "Favorite",
    "Not Favorite",
    "Oldest First",
    "Strong",
    "Weak",
    "Moderate",
  ];
  const [filteredPasswords, setFilteredPasswords] = useState(passwords);
  useEffect(() => {
    let newPasswords = [...passwords];

    if (searchTerms.trim()) {
      const lowerSearch = searchTerms.toLowerCase();
      newPasswords = newPasswords.filter(
        (pas) =>
          pas.siteName.toLowerCase().includes(lowerSearch) ||
          pas.userNames.some((username) =>
            username.toLowerCase().includes(lowerSearch),
          ),
      );
    }
    if (!selectedOpt.includes("all"))
      selectedOpt.forEach((opt) => {
        const strengthFilters = selectedOpt.filter((opt) =>
          ["strong", "moderate", "weak"].includes(opt),
        );
        if (strengthFilters.length > 0) {
          newPasswords = newPasswords.filter((pas) =>
            strengthFilters.includes(pas.strength),
          );
        }
        if (opt === "favorite")
          newPasswords = newPasswords.filter((pas) => pas.isFavorite);
        else if (opt === "not favorite")
          newPasswords = newPasswords.filter((pas) => !pas.isFavorite);
        else if (opt === "oldest first")
          newPasswords = [...newPasswords].reverse();
      });
    setFilteredPasswords(newPasswords);
  }, [searchTerms, selectedOpt, passwords]);

  const clearFilters = useCallback(() => {
    setsearchTerms("");
    setSelectedOpt(["all"]);
  }, []);

  return (
    <div className="w-full px-3 md:px-6 pt-4 pb-20 md:pb-6">
      {showMasterPassModel && (
        <MasterPasswordModel
          isOpen={showMasterPassModel}
          onClose={() => setShowMasterPassModel(false)}
        />
      )}
      {!loading && encKey && passwords.length === 0 && <EmptyVault />}
      {!loading && !encKey && (
        <VaultIsLocked onUnLoack={() => setShowMasterPassModel(true)} />
      )}
      {passwords.length !== 0 && (
        <>
          <div className="w-full flex flex-col gap-3 items-center">
            <div className="z-20 bg-gray-50 dark:bg-gray-950 pb-3 pt-1 space-y-3 w-[min(672px,100%)] mx-auto">

              {/* Title row */}
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h1 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Your Vault
                </h1>
                <span className="ml-auto text-xs font-bold text-gray-400 dark:text-gray-600">
                  {filteredPasswords.length} / {passwords.length}
                </span>
              </div>

              {/* Search bar */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchTerms}
                  onChange={(e) => setsearchTerms(e.target.value)}
                  placeholder="Search sites, usernames..."
                  className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-sm md:text-base"
                />
                {searchTerms && (
                  <button
                    onClick={() => setsearchTerms("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter pills — horizontal scroll */}
              <div className="flex gap-2 overflow-x-auto scroll-bar-hide justify-around">
                {filterOptArray.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      const lowerCaseOpt = opt.toLowerCase();
                      if (lowerCaseOpt === "all") {
                        setSelectedOpt(["all"]);
                      } else {
                        let newSelection = selectedOpt.filter(o => o !== "all");
                        if (lowerCaseOpt === "favorite")
                          newSelection = newSelection.filter(o => o !== "not favorite");
                        if (lowerCaseOpt === "not favorite")
                          newSelection = newSelection.filter(o => o !== "favorite");
                        if (selectedOpt.includes(lowerCaseOpt)) {
                          if (newSelection.length > 1)
                            newSelection = newSelection.filter(o => o !== lowerCaseOpt);
                        } else {
                          newSelection = [...newSelection, lowerCaseOpt];
                        }
                        setSelectedOpt(newSelection);
                      }
                    }}
                    className={`shrink-0 px-3.5 py-1 rounded-full font-semibold text-xs whitespace-nowrap transition-all duration-200 cursor-pointer
                      ${selectedOpt.includes(opt.toLowerCase())
                        ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-sm shadow-blue-500/25"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 w-[min(672px,100%)]">
              {isEditOpen && (
                <EditModal
                  {...{
                    isOpen: isEditOpen,
                    onClose: () => setIsEditOpen(false),
                    onSave: onSaveChanges,
                    editingData,
                    noMasterPass: () => {
                      setShowMasterPassModel(true);
                    },
                  }}
                />
              )}

              {filteredPasswords.length === 0 ? (
                <NoMatchFound ClearFilters={clearFilters} />
              ) : (
                filteredPasswords.map((item, i) => (
                  <ScrollReveal direction="up" key={item._id} delayMs={Math.min(i * 50, 300)}>
                    <PasswordCard
                      id={item._id}
                      platform={item.siteName}
                      usernames={item.userNames}
                      password={item.password}
                      isFav={item.isFavorite}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      strength={item.strength}
                      onToggleFavorite={onToggleFavorite}
                    />
                  </ScrollReveal>
                ))
              )}
            </div>
          </div>
        </>
      )}
      {loading && <Loader text="Loading Your Passwords..." color="blue" />}
      {showConfirmDeleteEntryModel && (
        <DeleteEntryModal
          {...{
            onClose: () => setshowConfirmDeleteEntryModel(false),
            callback: fetchPasswords,
            data: deleteEntryData,
            resetID: () => setDeleteEntryData({id:null, siteName:"", usernames:[]}),
          }}
        />
      )}
    </div>
  );
};

export default Passwords;