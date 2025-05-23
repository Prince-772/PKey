"use client"
import PasswordCard from "@/components/passwordCard";
import EditModal from "@/components/editPasswordModel"
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader/loader2";
import { PlusCircle, Search } from "lucide-react";
import { handleEditPassword, handleToggleFavorite } from "@/lib/passwords/editpasswords";
import toast, { Toaster } from "react-hot-toast";
import { handleDeletePassword } from "@/lib/passwords/deletePassword";
import { useMasterPass } from "@/context/MasterPassword";
import { useRouter } from "next/navigation";
import { decrypt } from "@/lib/passwords/encryptPassword";

const Passwords = () => {
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingData, setEditingData] = useState({
    username: "",
    platform: "",
    password: "",
    id: "",
  })

  const [passwords, setPasswords] = useState([])
  const { masterPass, resetTimer } = useMasterPass()
  const router = useRouter()

  const handleEdit = useCallback((data) => {
    if (!masterPass) return router.push("/masterPass?callback=vault")
    setEditingData(data)
    setIsEditOpen(true)
    resetTimer()
  }, [masterPass, router, resetTimer])


  const fetchPasswords = useCallback(async () => {
    if (!masterPass) return router.push("/masterPass?callback=vault")
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
      console.log(err);
      
      toast.error(err.message || "Faild to load your password!")
    } finally {
      setLoading(false)
      resetTimer()
    }
  }, [masterPass, router, resetTimer])

  const onToggleFavorite = useCallback(async (idToToggle, value) => {
    if (!masterPass) return router.push("/masterPass?callback=vault")
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
      error: (err) => {
        setPasswords(prevPasswords =>
          prevPasswords.map(p =>
            p._id === idToToggle ? { ...originalPassword } : p
          )
        );
        return err.message || "Something went wrong!"
      }
    })
  }, [passwords, handleToggleFavorite, toast, masterPass, router, resetTimer])


  const handleDelete = useCallback(async (id) => {
    if (!masterPass) return router.push("/masterPass?callback=vault")
    await toast.promise(handleDeletePassword(id), {
      loading: "Please wait...",
      success: (data) => {
        fetchPasswords()
        return data.message || "Entry Deleted!"
      },
      error: (err) => err.message || "Something went wrong!"
    })
  }, [handleDeletePassword, fetchPasswords, toast, masterPass, router])

  const onSaveChanges = useCallback((data) => {
    if (!masterPass) return router.push("/masterPass?callback=vault")
    toast.promise(handleEditPassword(data), {
      loading: "Saving...",
      success: (res) => {
        fetchPasswords()
        return res.message || "Changes saved!"
      },
      error: (err) => err.message || "Something went wrong!"
    })
  }, [fetchPasswords, handleEditPassword, toast, masterPass, router])

  useEffect(() => {
    fetchPasswords()
    
  }, [])
  useEffect(() => {
    console.log(passwords);

    
  }, [passwords])

  const [selectedOpt, setSelectedOpt] = useState(["all"])
  const filterOptArray = ["All", "Favorite", "Oldest First", "Strong", "Weak", "Moderte",];


  return (
    <div className="w-full p-3 md:px-6">
      <Toaster />
      {(!loading && passwords.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto text-center p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            Your Vault is Empty!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added any passwords yet.
            Click below to secure your first entry.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full shadow-lg
                    bg-gradient-to-r from-blue-600 to-purple-600 text-white
                    hover:from-blue-700 hover:to-purple-700
                    dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600
                    transition-all duration-300 ease-in-out text-base md:text-lg font-bold transform hover:-translate-y-1"
          >
            <PlusCircle className="w-5 h-5" /> Add New Password
          </Link>
        </div>
      )} {(passwords.length !== 0 &&
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
    </div>
  )
}

export default Passwords;