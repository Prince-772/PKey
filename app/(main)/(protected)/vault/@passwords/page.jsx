"use client";
import PasswordCard from "@/components/passwordCard";
import PasscodeCard from "@/components/passcodeCard";
import EditPasscodeModal from "@/components/EditPasscodeModal";
import EditModal from "@/components/editPasswordModel";
import { useCallback, useEffect, useState } from "react";
import Loader from "@/components/Loader/loader2";
import {
  handleEditPassword,
  handleToggleFavorite,
} from "@/lib/passwords/editpasswords";
import toast from "react-hot-toast";
import { useMasterPass } from "@/context/MasterPassword";
import EmptyVault from "@/components/emptyVaultMsg";
import VaultIsLocked from "@/components/lockVaultMessage";
import DeleteEntryModal from "@/components/confirmDeleteEntryModel";
import { ShieldCheck, Search, X } from "lucide-react";
import NoMatchFound from "@/components/noMatchFound";
import { encryptV3 } from "@/lib/passwords/encryptPassV3";
import { categorizePasscode } from "@/lib/passcodes/passcodeStrength";
import {
  handleEditPasscode,
  handleTogglePasscodeFavorite,
} from "@/lib/passcodes/editPasscode";
import ScrollReveal from "@/components/ScrollReveal";
import BlockedAccount from "@/components/BlockedAccountToast";
import { usePasswords } from "@/context/PasswordsProvider";
import { usePasscodes } from "@/context/PasscodesProvider.jsx";
import { useSearchParams } from "next/navigation";

const Passwords = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasscodeEditOpen, setIsPasscodeEditOpen] = useState(false);
  const [editingData, setEditingData] = useState({
    usernames: [""],
    platform: "",
    password: "",
    id: "",
    version: 0,
  });
  const [editingPasscodeData, setEditingPasscodeData] = useState({
    usernames: [""],
    platform: "",
    pin: "",
    id: "",
  });

  const {
    masterPass,
    encKey,
    resetTimer,
    showMasterPassModel,
    setShowMasterPassModel,
  } = useMasterPass();
  const {
    loading: passwordsLoading,
    passwords,
    fetchPasswords,
  } = usePasswords();
  const {
    loading: passcodesLoading,
    passcodes,
    fetchPasscodes,
  } = usePasscodes();
  const loading = passwordsLoading || passcodesLoading;
  const searchParams = useSearchParams();
  const vaultType = searchParams.get("type");

  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    const passwordsWithType = passwords.map((p) => ({
      ...p,
      type: "password",
    }));
    const passcodesWithType = passcodes.map((p) => ({
      ...p,
      type: "passcode",
    }));
    const combined = [...passwordsWithType, ...passcodesWithType];
    const getCreatedTime = (item) => {
      const parsedDate = Date.parse(item.createdAt);
      if (Number.isFinite(parsedDate)) return parsedDate;
      if (/^[a-f\d]{24}$/i.test(item._id)) {
        return Number.parseInt(item._id.slice(0, 8), 16) * 1000;
      }
      return 0;
    };
    combined.sort((a, b) => getCreatedTime(b) - getCreatedTime(a));
    setAllItems(combined);
  }, [passwords, passcodes]);
  const [showConfirmDeleteEntryModel, setshowConfirmDeleteEntryModel] =
    useState(false);
  const [deleteEntryData, setDeleteEntryData] = useState({
    id: null,
    siteName: "",
    usernames: [],
  });

  const handleEdit = useCallback(
    (data) => {
      if (!encKey) return setShowMasterPassModel(true);
      const item = allItems.find((i) => i._id === data.id);
      if (item?.type === "passcode") {
        setEditingPasscodeData(data);
        setIsPasscodeEditOpen(true);
        resetTimer();
        return;
      }
      setEditingData(data);
      setIsEditOpen(true);
      resetTimer();
    },
    [masterPass, encKey, resetTimer, allItems],
  );

  const onToggleFavorite = useCallback(
    async ({ idToToggle, value, onError }) => {
      if (!encKey) return setShowMasterPassModel(true);
      const item = allItems.find((i) => i._id === idToToggle);
      const toggleFn =
        item?.type === "passcode"
          ? handleTogglePasscodeFavorite
          : handleToggleFavorite;
      const newFavStatus = value;
      await toast.promise(toggleFn(idToToggle, newFavStatus), {
        loading: "Please wait...",
        success: (res) => {
          resetTimer();
          return res.message || "Changes saved!";
        },
        error: ({ message }) => {
          onError(!value);
          if (message === "BLOCKED_ACCOUNT") {
            return <BlockedAccount />;
          } else {
            return message || "Something went wrong";
          }
        },
      });
    },
    [allItems, masterPass, encKey, resetTimer],
  );

  const handleDelete = useCallback(
    async (data) => {
      if (!encKey) return setShowMasterPassModel(true);
      const item = allItems.find((i) => i._id === data.id);
      setDeleteEntryData({ ...data, type: item?.type || "password" });
      setshowConfirmDeleteEntryModel(true);
    },
    [masterPass, encKey, allItems],
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

  const onSavePasscodeChanges = useCallback(
    async ({ id, siteName, usernames, pin }) => {
      if (!encKey) {
        setShowMasterPassModel(true);
        return false;
      }

      const strength = categorizePasscode(pin).category;

      const payload = {
        id,
        siteName: await encryptV3(siteName, encKey),
        userNames: await Promise.all(
          usernames.map((username) => encryptV3(username, encKey)),
        ),
        pin: await encryptV3(pin, encKey),
        strength: await encryptV3(strength, encKey),
      };

      try {
        await toast.promise(handleEditPasscode(payload), {
          loading: "Saving passcode...",
          success: (res) => res.message || "Passcode updated!",
          error: ({ message }) =>
            message === "BLOCKED_ACCOUNT" ? "Account is blocked" : message,
        });
        await fetchPasscodes();
        resetTimer();
        return true;
      } catch {
        return false;
      }
    },
    [encKey, fetchPasscodes, resetTimer, setShowMasterPassModel],
  );

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
  const [filteredItems, setFilteredItems] = useState([]);
  useEffect(() => {
    let newItems = [...allItems];

    if (vaultType === "passwords") {
      newItems = newItems.filter((item) => item.type === "password");
    } else if (vaultType === "passcodes") {
      newItems = newItems.filter((item) => item.type === "passcode");
    }

    if (searchTerms.trim()) {
      const lowerSearch = searchTerms.toLowerCase();
      newItems = newItems.filter(
        (item) =>
          item.siteName.toLowerCase().includes(lowerSearch) ||
          item.userNames.some((username) =>
            username.toLowerCase().includes(lowerSearch),
          ),
      );
    }
    if (!selectedOpt.includes("all")) {
      selectedOpt.forEach((opt) => {
        const lowerOpt = opt.toLowerCase();
        const strengthFilters = selectedOpt.filter((o) =>
          ["strong", "moderate", "weak"].includes(o),
        );
        if (strengthFilters.length > 0) {
          newItems = newItems.filter((item) =>
            strengthFilters.includes(item.strength),
          );
        }
        if (lowerOpt === "favorite")
          newItems = newItems.filter((item) => item.isFavorite);
        else if (lowerOpt === "not favorite")
          newItems = newItems.filter((item) => !item.isFavorite);
        else if (lowerOpt === "oldest first")
          newItems = [...newItems].reverse();
      });
    }
    setFilteredItems(newItems);
  }, [searchTerms, selectedOpt, allItems, vaultType]);

  const clearFilters = useCallback(() => {
    setsearchTerms("");
    setSelectedOpt(["all"]);
  }, []);

  return (
    <div className="w-full px-3 md:px-6 pt-4 pb-20 md:pb-6">
      {!loading && encKey && allItems.length === 0 && <EmptyVault />}
      {!loading && !encKey && (
        <VaultIsLocked onUnLoack={() => setShowMasterPassModel(true)} />
      )}
      {allItems.length !== 0 && (
        <>
          <div className="w-full flex flex-col gap-3 items-center">
            <ScrollReveal className="w-[min(672px,100%)] mx-auto">
              <div className="z-20 bg-gray-50 dark:bg-gray-950 pb-3 pt-1 space-y-3">
                {/* Title row */}
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-blue-600 dark:text-blue-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h1 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Your Vault
                  </h1>
                  <span className="ml-auto text-xs font-bold text-gray-400 dark:text-gray-600">
                    {filteredItems.length} / {allItems.length}
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

                {/* Filter pills. horizontal scroll */}
                <div className="flex gap-2 overflow-x-auto scroll-bar-hide justify-around">
                  {filterOptArray.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        const lowerCaseOpt = opt.toLowerCase();
                        if (lowerCaseOpt === "all") {
                          setSelectedOpt(["all"]);
                        } else {
                          let newSelection = selectedOpt.filter(
                            (o) => o !== "all",
                          );
                          if (lowerCaseOpt === "favorite")
                            newSelection = newSelection.filter(
                              (o) => o !== "not favorite",
                            );
                          if (lowerCaseOpt === "not favorite")
                            newSelection = newSelection.filter(
                              (o) => o !== "favorite",
                            );
                          if (selectedOpt.includes(lowerCaseOpt)) {
                            if (newSelection.length > 1)
                              newSelection = newSelection.filter(
                                (o) => o !== lowerCaseOpt,
                              );
                          } else {
                            newSelection = [...newSelection, lowerCaseOpt];
                          }
                          setSelectedOpt(newSelection);
                        }
                      }}
                      className={`shrink-0 px-3.5 py-1 rounded-full font-semibold text-xs whitespace-nowrap transition-all duration-200 cursor-pointer
                      ${
                        selectedOpt.includes(opt.toLowerCase())
                          ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-sm shadow-blue-500/25"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

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
              {isPasscodeEditOpen && (
                <EditPasscodeModal
                  isOpen={isPasscodeEditOpen}
                  onClose={() => setIsPasscodeEditOpen(false)}
                  data={editingPasscodeData}
                  onSave={onSavePasscodeChanges}
                />
              )}

              {filteredItems.length === 0 ? (
                <NoMatchFound ClearFilters={clearFilters} />
              ) : (
                filteredItems.map((item, i) => (
                  <ScrollReveal
                    direction="right"
                    key={item._id}
                    delayMs={Math.min(i * 50, 300)}
                    rootMargin="0% 0% 5% 0%"
                  >
                    {item.type === "passcode" ? (
                      <PasscodeCard
                        id={item._id}
                        platform={item.siteName}
                        usernames={item.userNames}
                        pin={item.pin}
                        isFav={item.isFavorite}
                        strength={item.strength}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleFavorite={onToggleFavorite}
                      />
                    ) : (
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
                    )}
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
            callback:
              deleteEntryData.type === "passcode"
                ? fetchPasscodes
                : fetchPasswords,
            data: deleteEntryData,
            resetID: () =>
              setDeleteEntryData({ id: null, siteName: "", usernames: [] }),
          }}
        />
      )}
    </div>
  );
};

export default Passwords;
