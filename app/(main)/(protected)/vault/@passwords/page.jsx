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
import MasterPasswordModel from "@/components/masterPassPage";
import EmptyVault from "@/components/emptyVaultMsg";
import VaultIsLocked from "@/components/lockVaultMessage";
import DeleteEntryModal from "@/components/confirmDeleteEntryModel";
import { ShieldCheck, SlidersHorizontal, Search } from "lucide-react";
import NoMatchFound from "@/components/noMatchFound";
import { UpdateToDV3 } from "@/lib/passwords/updatetonew/updatetonew";
import { decryptV3, encryptV3 } from "@/lib/passwords/encryptPassV3";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const Passwords = () => {
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingData, setEditingData] = useState({
    username: "",
    platform: "",
    password: "",
    id: "",
    version: 0,
  });

  const [passwords, setPasswords] = useState([]);
  const { masterPass, setMasterPass, encKey, resetTimer } = useMasterPass();
  const [showMasterPassModel, setShowMasterPassModel] = useState(false);
  const [showConfirmDeleteEntryModel, setshowConfirmDeleteEntryModel] =
    useState(false);
  const [deleteEntryId, setdeleteEntryId] = useState(null);
  const { data: session, update } = useSession();

  const handleEdit = useCallback(
    (data) => {
      if (!encKey) return setShowMasterPassModel(true);
      setEditingData(data);
      setIsEditOpen(true);
      resetTimer();
    },
    [masterPass, encKey, resetTimer],
  );

  const fetchPasswords = useCallback(async () => {
    if (!encKey) {
      if (passwords.length > 0) setPasswords([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passwords/getallpasswords`,
      );
      const getPasswords = res.data.data;

      const oldDocs = []; // To store the new encrypted data of Dv1 or Dv2
      // decrypting in client side
      const deCryptedData = await Promise.all(getPasswords.map(async (p) => {
        // For Old Entries, Updaing to new
        if (p.version === 1) {

          let { userName, siteName, strength } = p;
          const userNameV3 = await encryptV3(userName, encKey);
          const siteNameV3 = await encryptV3(siteName, encKey);
          const strengthV3 = await encryptV3(strength, encKey);
          const password = decrypt(p.password, masterPass); // Getting raw password
          const passwordV3 = await encryptV3(password, encKey); // Encrypting raw password to dv3 version
          const newData = {
            ...p,
            password: passwordV3,
            userName: userNameV3,
            siteName: siteNameV3,
            strength: strengthV3,
            version: 3,
          };
          oldDocs.push(newData);
          return { ...p, password };
        }
        //For Dv2 Entries
        else if (p.version === 2) {
          // Extracting raw data from old algo
          const siteName = decrypt(p.siteName, masterPass);
          const userName = decrypt(p.userName, masterPass);
          const strength = decrypt(p.strength, masterPass);
          const password = decrypt(p.password, masterPass);
          const siteNameV3 = await encryptV3(siteName, encKey);
          const userNameV3 = await encryptV3(userName, encKey);
          const strengthV3 = await encryptV3(strength, encKey);
          const passwordV3 = await encryptV3(password, encKey);

          const newData = {
            ...p,
            password: passwordV3,
            userName: userNameV3,
            siteName: siteNameV3,
            strength: strengthV3,
            version: 3,
          };

          oldDocs.push(newData);

          return {
            ...p,
            siteName,
            userName,
            strength,
            password,
          };
        }
        // For dv3 Entries
        else {
          return {
            ...p,
            siteName: await decryptV3(p.siteName, encKey),
            userName: await decryptV3(p.userName, encKey),
            password: await decryptV3(p.password, encKey),
            strength: await decryptV3(p.strength, encKey),
          };
        }
      }));
      setPasswords(deCryptedData);
      // To updated the stored old entries to new
      if (oldDocs.length > 0) {
        toast.promise(UpdateToDV3(oldDocs), {
          loading: "Securing Your Entries...",
          success: async (res) => {
            if (res.isAllUpdated && session) {
              await update({
                ...session,
                user: {
                  ...session.user,
                  version: 3,
                },
              });
            }
            setMasterPass(null); // No need of mPass as user is migrated to Uv3
            return res.message || "Secured!";
          },
          error: ({ message }) => {
            if (message === "BLOCKED_ACCOUNT") {
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
              return message || "Migration Failed, We'll try again later";
            }
          },
        });
      }
    } catch (err) {
      toast.error(() => {
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
      });
    } finally {
      setLoading(false);
      resetTimer();
    }
  }, [masterPass, encKey]);

  const onToggleFavorite = useCallback(
    async (idToToggle, value) => {
      if (!encKey) return setShowMasterPassModel(true);
      const passIndex = passwords.findIndex((p) => p._id === idToToggle);
      if (passIndex === -1) return;

      const originalPassword = passwords[passIndex];
      const newFavStatus = value;
      setPasswords((prevPasswords) =>
        prevPasswords.map((p) =>
          p._id === idToToggle ? { ...p, isFavorite: newFavStatus } : p,
        ),
      );
      await toast.promise(handleToggleFavorite(idToToggle, newFavStatus), {
        loading: "Please wait...",
        success: (res) => {
          resetTimer();
          return res.message || "Changes saved!";
        },
        error: ({ message }) => {
          setPasswords((prevPasswords) =>
            prevPasswords.map((p) =>
              p._id === idToToggle ? { ...originalPassword } : p,
            ),
          );
          if (message === "BLOCKED_ACCOUNT") {
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
            return message || "Something went wrong";
          }
        },
      });
    },
    [passwords, masterPass, encKey, resetTimer],
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!encKey) return setShowMasterPassModel(true);
      setdeleteEntryId(id);
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
            return message || "Something went wrong";
          }
        },
      });
    },
    [masterPass, encKey],
  );

  useEffect(() => {
    fetchPasswords();
    return () => setShowMasterPassModel(false);
  }, [masterPass, encKey]);

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
          pas.userName.toLowerCase().includes(lowerSearch),
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
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex flex-col items-center justify-center relative"
          >
            <div className="w-full flex flex-col items-center justify-center pb-6 bg-gray-50 dark:bg-gray-950">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-60 md:h-75 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
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

              <div className="w-full max-w-3xl rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none relative z-10">
                {/* Search Bar */}
                <div className="relative group mb-6">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchTerms}
                    onChange={(e) => setsearchTerms(e.target.value)}
                    placeholder="Search platforms, usernames..."
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950 border-2 border-transparent focus:bg-white dark:focus:bg-gray-900 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-blue-500 dark:focus:border-blue-500/50 hover:border-gray-200 dark:hover:border-gray-800 transition-all duration-300 text-base md:text-lg shadow-inner focus:shadow-blue-500/10"
                  />
                </div>
              </div>

              <div className="w-full max-w-2xl flex flex-col gap-4">
                {/* Filter Options */}
                <div className="filter">
                  <div className="scroll-bar-hide flex gap-2 sm:gap-4 overflow-x-auto pb-1 px-1 justify-evenly">
                    {filterOptArray.map((opt, index) => (
                      <button
                        key={index}
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
                              newSelection = [...newSelection, lowerCaseOpt];
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
                    ))}
                  </div>
                </div>
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
                  <PasswordCard
                    key={item._id}
                    id={item._id}
                    platform={item.siteName}
                    username={item.userName}
                    password={item.password}
                    isFav={item.isFavorite}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    strength={item.strength}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
      {loading && <Loader text="Loading Your Passwords..." color="blue" />}
      {showConfirmDeleteEntryModel && (
        <DeleteEntryModal
          {...{
            onClose: () => setshowConfirmDeleteEntryModel(false),
            callback: fetchPasswords,
            id: deleteEntryId,
            resetID: () => setdeleteEntryId(null),
          }}
        />
      )}
    </div>
  );
};

export default Passwords;
