"use client"
import Image from 'next/image'
import Link from 'next/link'
import NavLink from './NavLink'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
import { CircleUserRound, Eraser, LayoutDashboard, Loader, LoaderCircle, Lock, LockKeyhole, LogIn, LogOut, Moon, RotateCcw, Sun, Undo2, UserRoundX } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import Logo from './logo'
import DeleteAccountModal from './deleteAccountModel'
import ResetVaultModal from './resetVault'


const NavBar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const unProtectedRoutes = ["/", "/how-it-works", "/privacy-policy", "/terms&conditions", "/blocked-accounts-help"]
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(document.body.classList.contains("dark"))
  }, [])

  const showLoading = status === "loading"
  const showSignIn = status === "unauthenticated" && unProtectedRoutes.includes(pathname)
  const showVault = status === "authenticated" && pathname === "/dashboard"
  const showDashboard = status === "authenticated" && pathname !== "/dashboard"
  const showGithub = unProtectedRoutes.includes(pathname);
  const showProfile = status === "authenticated" && !unProtectedRoutes.includes(pathname);
  const showToggleTheme = unProtectedRoutes.includes(pathname);

  const [isProfileView, setIsProfileView] = useState(false)
  const [openDeleteAccountModel, setOpenDeleteAccountModel] = useState(false)
  const [openResetVaultModel, setOpenResetVaultModel] = useState(false)
  const HandleLogOut = () => {
    signOut({ redirect: false })
    router.push("/")
  }
  const handleDeleteAccount = () => {
    if (!unProtectedRoutes.includes(pathname))
      setIsProfileView(false)
    setOpenDeleteAccountModel(true)
  }
  const handleResetVault = () => {
    if (!unProtectedRoutes.includes(pathname))
      setIsProfileView(false)
    setOpenResetVaultModel(true)
  }

  const toggleTheme = () => {
    document.body.classList.toggle("dark")
    setIsDark(prev => !prev)
    setIsProfileView(false)
  }


  return (
    <nav className='w-full flex h-16 bg-white dark:bg-gray-950 shadow-md shadow-gray-200/50 dark:shadow-black/50 fixed top-0 left-0 z-50 border-b border-gray-100 dark:border-gray-800'>
      <div className='container mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center h-full'>
        {/* Logo */}
        <Logo />
        {openDeleteAccountModel && <DeleteAccountModal {...{ isOpen: openDeleteAccountModel, onClose: () => setOpenDeleteAccountModel(false), showPasswordInput: session.user.provider === "credentials" }} />}
        {openResetVaultModel && <ResetVaultModal {...{ isOpen: openResetVaultModel, onClose: () => setOpenResetVaultModel(false), showPasswordInput: session.user.provider === "credentials" }} />}
        {/* Navigation Links and User Actions */}
        <div className="flex items-center gap-4 md:gap-6 justify-around">
          {showToggleTheme && <button
            className='flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700
                         text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50
                         transition-colors duration-200 text-sm md:text-base font-medium'
            onClick={toggleTheme}>
            {isDark ? <Sun className='w-5 h-5 md:h-6 md:w-6 text-yellow-400' /> : <Moon className='w-5 h-5 md:h-6 md:w-6' />}
          </button>}
          {/* GitHub Link */}
          {showGithub && (
            <a
              href="https://github.com/Prince-772/PKey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700
                         text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50
                         transition-colors duration-200 text-sm md:text-base font-medium"
            >
              <div className="relative h-5 w-5 md:h-6 md:w-6">
                <Image
                  src="/images/github.svg"
                  fill
                  priority
                  className="object-contain dark:invert" // Use dark:invert for SVGs to adjust in dark mode
                  alt="GitHub"
                />
              </div>
              <span className='hidden sm:inline'>GitHub</span> {/* Changed to sm:inline for better mobile */}
            </a>
          )}

          {/* Dynamic Links (Vault, Dashboard) */}
          {showVault && <NavLink href="/vault" icon={<LockKeyhole className='w-5 h-5' />} label="Vault" />}
          {showDashboard && <NavLink href="/dashboard" icon={<LayoutDashboard className='w-5 h-5' />} label="Dashboard" />}
          {showLoading && <LoaderCircle className='animate-spin text-blue-600 dark:text-blue-400 w-6 h-6' />}

          {/* Sign In Button */}
          {showSignIn && (
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md
                         bg-gradient-to-r from-blue-600 to-purple-600 text-white
                         hover:from-blue-700 hover:to-purple-700
                         dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600
                         transition-all duration-200 text-sm md:text-base font-semibold"
            >
              <LogIn className='h-5 w-5' />
              Sign In
            </Link>
          )}

          {/* User Profile Dropdown */}
          {showProfile && (
            <div className="relative">
              <button
                onClick={() => setIsProfileView((prev) => !prev)}
                className="relative flex items-center cursor-pointer justify-center rounded-full p-0.5
                           w-8 h-8 md:w-10 md:h-10 transition-transform duration-200 hover:scale-105"
              >
                {session?.user?.image ? (
                  <Image
                    src={session?.user?.image}
                    fill
                    priority
                    className="object-cover rounded-full" // Use object-cover for profile images
                    alt={session.user.name || "User Profile"}
                  />
                ) : (
                  <CircleUserRound className="w-full h-full text-gray-500 dark:text-gray-400 group-hover:text-blue-600 transition-colors duration-200" color={isProfileView ? "blue" : "currentColor"} />
                )}
              </button>

              {/* Profile Dropdown Content */}
              {isProfileView && (
                <div className="absolute right-1/2 mt-0 bg-white dark:bg-gray-800 rounded-md rounded-tr-none shadow-lg overflow-hidden
                ring-1 ring-black/5 dark:ring-gray-700 z-50 origin-top-right
                animate-fade-in-down">
                  <button
                    onClick={toggleTheme}
                    className="text-nowrap flex gap-1 cursor-pointer items-center font-inter w-full text-left px-2 md:px-4 py-1 md:py-2 text-sm
                   text-blue-600 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-150"
                  >
                    {isDark ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />} Toggle Theme
                  </button>

                  <button
                    onClick={HandleLogOut}
                    className="text-nowrap flex gap-1 cursor-pointer items-center font-inter w-full text-left px-2 md:px-4 py-1 md:py-2 text-sm
                   text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150"
                  >
                    <LogOut className='w-4 h-4' /> Logout
                  </button>
                  <button
                    onClick={handleResetVault}
                    className="text-nowrap flex gap-1 cursor-pointer items-center font-inter w-full text-left px-2 md:px-4 py-1 md:py-2 text-sm
                   text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150"
                  >
                    <Eraser className='w-4 h-4' /> Reset Vault
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="text-nowrap flex gap-1 cursor-pointer items-center font-inter w-full text-left px-2 md:px-4 py-1 md:py-2 text-sm
                   text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150"
                  >
                    <UserRoundX className='w-4 h-4' /> Delete Account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>

  )
}

export default NavBar