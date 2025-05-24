"use client"
import PasswordCard from "@/components/passwordCard";
import EditModal from "@/components/editPasswordModel"
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader/loader2";
import { handleEditPassword, handleToggleFavorite } from "@/lib/passwords/editpasswords";
import toast, { Toaster } from "react-hot-toast";
import { useMasterPass } from "@/context/MasterPassword";
import { decrypt } from "@/lib/passwords/encryptPassword";
import MasterPasswordModel from "@/components/masterPassPage";
import EmptyVault from "@/components/emptyVaultMsg";
import VaultIsLocked from "@/components/lockVaultMessage";
import DeleteEntryModal from "@/components/confirmDeleteEntryModel";
import { Search } from "lucide-react";

const Passwords = () => {
  const [loading, setLoading] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingData, setEditingData] = useState({
    username: "",
    platform: "",
    password: "",
    id: "",
  })

  const [passwords, setPasswords] = useState([])
  const { masterPass, resetTimer } = useMasterPass()
  const [showMasterPassModel, setshowMasterPassModel] = useState(false)
  const [showConfirmDeleteEntryModel, setshowConfirmDeleteEntryModel] = useState(false)
  const [deleteEntryId, setdeleteEntryId] = useState(null)

  const handleEdit = useCallback((data) => {
    if (!masterPass) return setshowMasterPassModel(true)
    setEditingData(data)
    setIsEditOpen(true)
    resetTimer()
  }, [masterPass, resetTimer])


  const fetchPasswords = useCallback(async () => {
    if (!masterPass) return setshowMasterPassModel(true)
    try {
      setLoading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passwords/getallpasswords`)
      const getPasswords = res.data.data

      // decrypting in client side
      const deCryptedData = getPasswords.map(p => {
        return { ...p, password: decrypt(p.password, masterPass) }
      })
      setPasswords(deCryptedData)
    } catch (err) {
      toast.error(() => {
        if (err.message === "BLOCKED_ACCOUNT") {
          return (
            <span>
              Your account is blocked due to too many invalid attempts.{" "}
              <Link href="/blocked-accounts-help" className="underline text-blue-500">
                Learn what to do
              </Link>
            </span>
          );
        } else {
          return err.message || "Something went wrong";
        }
      })
    } finally {
      setLoading(false)
      resetTimer()
    }
  }, [masterPass, resetTimer])

  const onToggleFavorite = useCallback(async (idToToggle, value) => {
    if (!masterPass) return setshowMasterPassModel(true)
    const passIndex = passwords.findIndex(p => p._id === idToToggle);
    if (passIndex === -1) return;

    const originalPassword = passwords[passIndex];
    const newFavStatus = value;
    setPasswords(prevPasswords =>
      prevPasswords.map(p =>
        p._id === idToToggle ? { ...p, isFavorite: newFavStatus } : p
      )
    );
    await toast.promise(handleToggleFavorite(idToToggle, newFavStatus), {
      loading: "Please wait...",
      success: (res) => {
        resetTimer()
        return res.message || "Changes saved!"
      },
      error: ({ message }) => {
        setPasswords(prevPasswords =>
          prevPasswords.map(p =>
            p._id === idToToggle ? { ...originalPassword } : p
          )
        );
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
  }, [passwords, masterPass, resetTimer])


  const handleDelete = useCallback(async (id) => {
    if (!masterPass) return setshowMasterPassModel(true)
    setdeleteEntryId(id)
    setshowConfirmDeleteEntryModel(true)
  }, [masterPass])

  const onSaveChanges = useCallback((data) => {
    if (!masterPass) return setshowMasterPassModel(true)
    toast.promise(handleEditPassword(data), {
      loading: "Saving...",
      success: (res) => {
        fetchPasswords()
        return res.message || "Changes saved!"
      },
      error: ({ message }) => {
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
  }, [masterPass])

  useEffect(() => {
    fetchPasswords()
    return () => setshowMasterPassModel(false)
  }, [masterPass])

  const [selectedOpt, setSelectedOpt] = useState(["all"])
  const filterOptArray = ["All", "Favorite", "Oldest First", "Strong", "Weak", "Moderte",];


  return (
    <div className="w-full p-3 md:px-6">
      <Toaster />
      {showMasterPassModel && <MasterPasswordModel isOpen={showMasterPassModel} onClose={() => setshowMasterPassModel(false)} />}
      {(!loading && masterPass && passwords.length === 0) && (
        <EmptyVault />
      )}
      {(!loading && !masterPass) && <VaultIsLocked onUnLoack={() => setshowMasterPassModel(true)} />}
      {(passwords.length !== 0 &&
        <>
          <div className="w-full flex flex-col items-center justify-center pb-6 bg-gray-50 dark:bg-gray-950">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent font-inter bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Your Secure Vault
            </h1>

            <div className="w-full max-w-2xl flex flex-col gap-4">
              {/* Search Bar */}
              <div className='relative'>
                <input
                  type="text"
                  placeholder="Search your passwords..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg
                     bg-white dark:bg-gray-700
                     border-gray-300 dark:border-gray-600
                     text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     outline-none focus:border-blue-500 dark:focus:border-blue-400
                     transition duration-200 text-base md:text-lg shadow-sm"
                />
                <Search className='absolute w-5 h-5 top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400' />
              </div>

              {/* Filter Options */}
              <div className='filter'>
                <div className="scroll-bar-hide flex gap-2 sm:gap-4 overflow-x-auto pb-1 px-1 justify-evenly">
                  {filterOptArray.map((opt, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const lowerCaseOpt = opt.toLowerCase();
                        if (selectedOpt.includes(lowerCaseOpt)) {
                          // Allow deselecting unless it's the last selected option
                          if (selectedOpt.length > 1) {
                            setSelectedOpt(selectedOpt.filter(option => option !== lowerCaseOpt));
                          }
                        } else {
                          setSelectedOpt([...selectedOpt, lowerCaseOpt]);
                        }
                      }}
                      className={`flex-shrink-0 px-5 sm:px-7 py-1 rounded-full font-medium text-sm md:text-base whitespace-nowrap
                          ${selectedOpt.includes(opt.toLowerCase())
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/30 dark:shadow-blue-700/50"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }
                          transition-all duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-10">
            {isEditOpen && <EditModal
              {...{
                isOpen: isEditOpen, onClose: () => setIsEditOpen(false), onSave: onSaveChanges, editingData
              }} />}

            {passwords.map((item) => (
              <PasswordCard
                key={item._id}
                id={item._id}
                platform={item.siteName}
                username={item.userName}
                password={item.password}
                isFav={item.isFavorite}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </>
      )}
      {loading && <Loader text="Loading Your Passwords..." color="blue" />}
      {showConfirmDeleteEntryModel && <DeleteEntryModal {...{ onClose: () => setshowConfirmDeleteEntryModel(false), callback: fetchPasswords, id: deleteEntryId, resetID: () => setdeleteEntryId(null) }} />}
    </div>
  )
}

export default Passwords;