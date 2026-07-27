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
    <div className="w-full p-3 md:px-6">
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
          <div className="w-full flex flex-col items-center justify-center relative">
            <div className="w-full flex flex-col items-center justify-center pb-6 bg-gray-50 dark:bg-gray-950">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-60 md:h-75 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
              <ScrollReveal>
                <div className="flex flex-col items-center mb-5 relative z-10">
                  <div className="p-3 mb-2 md:mb-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md shadow-blue-500/5 text-blue-600 dark:text-blue-400">
                    <ShieldCheck className="w-5 h-5 md:w-8 md:h-8" />
                  </div>
                  <h1 className="text-2xl md:text-5xl font-black text-center text-gray-900 dark:text-white tracking-tight mb-3">
                    Your Secure Vault
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-xs md:text-sm text-center">
                    All your digital keys, encrypted and organized.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal className="w-full max-w-3xl">
                <div className="rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none relative z-10">
                  {/* Search Bar */}
                  <div className="relative group mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-blue-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={searchTerms}
                      onChange={(e) => setsearchTerms(e.target.value)}
                      placeholder="Search platforms, usernames..."
                      className="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-gray-950 border-2 border-transparent focus:bg-white dark:focus:bg-gray-900 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-blue-500 dark:focus:border-blue-500/50 hover:border-gray-200 dark:hover:border-gray-800 transition-all duration-300 text-base md:text-lg shadow-inner focus:shadow-blue-500/10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <X
                        onClick={() => setsearchTerms("")}
                        className="w-5 h-5 text-gray-400 transition-colors cursor-pointer hover:text-red-500 active:text-red-500 group-focus-within:text-red-500"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <div className="w-full max-w-2xl flex flex-col gap-4">
                {/* Filter Options */}
                <ScrollReveal>
                  <div className="filter">
                    <div className="scroll-bar-hide flex gap-2 sm:gap-4 overflow-x-auto pb-1 px-1 justify-evenly">
                      {filterOptArray.map((opt, index) => (
                        <ScrollReveal
                          key={index}
                          direction="down"
                          delayMs={index * 100}
                        >
                          <button
                            onClick={() => {
                              const lowerCaseOpt = opt.toLowerCase();

                              if (lowerCaseOpt === "all") {
                                // Selecting "all" clears other filters
                                setSelectedOpt(["all"]);
                              } else {
                                // Selecting other filters removes "all"
                                let newSelection = selectedOpt.filter(
                                  (option) => option !== "all",
                                );
                                if (
                                  lowerCaseOpt === "favorite" &&
                                  newSelection.includes("not favorite")
                                )
                                  newSelection = newSelection.filter(
                                    (opt) => opt !== "not favorite",
                                  );
                                if (
                                  lowerCaseOpt === "not favorite" &&
                                  newSelection.includes("favorite")
                                )
                                  newSelection = newSelection.filter(
                                    (opt) => opt !== "favorite",
                                  );
                                if (selectedOpt.includes(lowerCaseOpt)) {
                                  // Deselect if not the last option
                                  if (newSelection.length > 1) {
                                    newSelection = newSelection.filter(
                                      (option) => option !== lowerCaseOpt,
                                    );
                                  }
                                } else {
                                  newSelection = [
                                    ...newSelection,
                                    lowerCaseOpt,
                                  ];
                                }

                                setSelectedOpt(newSelection);
                              }
                            }}
                            className={`shrink-0 px-5 sm:px-7 py-1 rounded-full font-medium text-sm md:text-base whitespace-nowrap
                        ${
                          selectedOpt.includes(opt.toLowerCase())
                            ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/30 dark:shadow-blue-700/50"
                            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }
                        transition-all duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          >
                            {opt}
                          </button>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-10 w-full">
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
                filteredPasswords.map((item) => (
                  <ScrollReveal direction="up" key={item._id} delayMs={100}>
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
