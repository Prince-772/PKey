"use client";
import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CircleUserRound,
  Eraser,
  LayoutDashboard,
  Loader,
  LoaderCircle,
  Lock,
  LockKeyhole,
  LockKeyholeOpen,
  LogIn,
  LogOut,
  Moon,
  PencilLine,
  RotateCcw,
  Sun,
  Undo2,
  UserRoundX,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useMasterPass } from "@/context/MasterPassword";
import { useRouter } from "next/navigation";
import Logo from "./logo";
import DeleteAccountModal from "./deleteAccountModel";
import ResetVaultModal from "./resetVault";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const unProtectedRoutes = [
    "/",
    "/security",
    "/password-strength",
    "/master-password",
    "/privacy-policy",
    "/terms&conditions",
    "/blocked-accounts-help",
  ];
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("pKey-isDark");

    let isDarkNow;

    if (savedTheme !== null) {
      isDarkNow = savedTheme === "true";
    } else {
      isDarkNow = document.documentElement.classList.contains("dark");
    }

    setIsDark(isDarkNow);
    document.documentElement.classList.toggle("dark", isDarkNow);
  }, []);

  const { setMasterPass, setEncKey, encKey } = useMasterPass();

  const showLoading = status === "loading";
  const showSignIn =
    status === "unauthenticated" && unProtectedRoutes.includes(pathname);
  const showVault = status === "authenticated" && pathname === "/dashboard";
  const showDashboard = status === "authenticated" && pathname !== "/dashboard";
  const showGithub = unProtectedRoutes.includes(pathname);
  const showProfile =
    status === "authenticated" && !unProtectedRoutes.includes(pathname);
  const showToggleTheme = unProtectedRoutes.includes(pathname);

  const [isProfileView, setIsProfileView] = useState(false);
  const [openDeleteAccountModel, setOpenDeleteAccountModel] = useState(false);
  const [openResetVaultModel, setOpenResetVaultModel] = useState(false);
  const HandleLogOut = async () => {
    await signOut({ redirect: false });
    setMasterPass(null);
    setEncKey(null);
    router.push("/");
  };
  const handleDeleteAccount = () => {
    if (!unProtectedRoutes.includes(pathname)) setIsProfileView(false);
    setOpenDeleteAccountModel(true);
  };
  const handleResetVault = () => {
    if (!unProtectedRoutes.includes(pathname)) setIsProfileView(false);
    setOpenResetVaultModel(true);
  };

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev;

      document.documentElement.classList.toggle("dark", newValue);
      localStorage.setItem("pKey-isDark", newValue);

      return newValue;
    });

    setIsProfileView(false);
  };

  const lockValut = () => {
    setEncKey(null);
    setMasterPass(null);
    setIsProfileView(false);
    toast.success("Your Vault is now locked");
  };

  const forwardToForgetPassword = () => {
    return router.push("/reset-password");
  };

  return (
    <nav className="w-full h-16 bg-linear-to-r from-purple-100 to-blue-100/50 dark:to-purple-950/30 dark:from-blue-950/50 backdrop-blur-sm fixed top-0 left-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 shadow-md dark:shadow-gray-900">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center h-full">
        <div className="flex items-center gap-2 group">
          <Logo />
        </div>

        {openDeleteAccountModel && (
          <DeleteAccountModal
            {...{
              isOpen: openDeleteAccountModel,
              onClose: () => setOpenDeleteAccountModel(false),
              showPasswordInput: session.user.provider === "credentials",
            }}
          />
        )}
        {openResetVaultModel && (
          <ResetVaultModal
            {...{
              isOpen: openResetVaultModel,
              onClose: () => setOpenResetVaultModel(false),
              showPasswordInput: session.user.provider === "credentials",
            }}
          />
        )}

        <div className="flex items-center gap-2 md:gap-4">
          {showToggleTheme && (
            <button
              className="flex cursor-pointer items-center justify-center p-1 sm:p-2 rounded-full border border-gray-300 dark:border-gray-700
                         text-gray-700 dark:text-gray-300 duration-300 hover:-translate-y-px hover:scale-105 active:scale-97
                         shadow-sm hover:shadow-md dark:shadow-gray-900 transition-all text-sm md:text-base font-medium bg-gray-50/50 dark:bg-gray-900/50 hover:border-blue-500"
              onClick={toggleTheme}
            >
              {isDark ? (
                <Sun className="h-6 w-6 text-yellow-400 m-auto" />
              ) : (
                <Moon className="h-6 w-6 text-blue-600 m-auto" />
              )}
            </button>
          )}
          {showGithub && (
            <NavLink
              href="https://github.com/Prince-772/PKey"
              icon={
                <div className="relative h-6 w-6">
                  <Image
                    src="/images/github.svg"
                    fill
                    className="object-contain dark:invert"
                    alt="GitHub"
                  />
                </div>
              }
              label="GitHub"
              openInNewTab={true}
            />
          )}

          {(showVault || showDashboard) && (
            <div className="flex items-center gap-2">
              {showVault && (
                <NavLink
                  href="/vault"
                  icon={<LockKeyhole className="w-6 h-6" />}
                  label="Vault"
                />
              )}
              {showDashboard && (
                <NavLink
                  href="/dashboard"
                  icon={<LayoutDashboard className="w-6 h-6" />}
                  label="Dashboard"
                />
              )}
            </div>
          )}

          {showLoading && (
            <LoaderCircle className="animate-spin text-blue-600 w-5 h-5" />
          )}

          {showSignIn && (
            <Link
              href="/sign-in"
              className="relative inline-flex items-center gap-2 px-3 md:px-5 py-2 overflow-hidden font-bold text-white rounded-full bg-linear-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group"
            >
              <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0 duration-300" />
              <span className="text-sm">Sign In</span>
            </Link>
          )}

          {showProfile && (
            <div className="flex items-center gap-2 pl-3 md:pl-4">
              <div className="relative">
                <button
                  onClick={() => setIsProfileView((prev) => !prev)}
                  className={`cursor-pointer relative flex items-center justify-center rounded-full w-9 h-9 md:w-10 md:h-10 border-2 transition-all duration-300 hover:scale-105 active:scale-95 border-blue-500/0 hover:border-blue-500 ${isProfileView ? "shadow-md" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  {session?.user?.image ? (
                    <Image
                      src={session?.user?.image}
                      fill
                      className="object-cover rounded-full p-0.5 m-auto"
                      alt="User"
                    />
                  ) : (
                    <CircleUserRound
                      className={`w-full h-full ${isProfileView ? "text-blue-500" : "text-gray-500"}`}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {isProfileView && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-[50%] mt-1 bg-white dark:bg-gray-900 rounded-2xl rounded-tr-none shadow-2xl border border-gray-500 overflow-hidden z-50 origin-top-right"
                    >
                      <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-nowrap">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Account
                        </p>
                        <p className="text-sm font-bold truncate dark:text-gray-200">
                          {session?.user?.name?.split(" ")[0] || "PKey User"}
                        </p>
                      </div>

                      <div className="p-1.5 text-nowrap">
                        <button
                          onClick={toggleTheme}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all duration-300 cursor-pointer"
                        >
                          {isDark ? (
                            <Sun className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Moon className="w-4 h-4 text-blue-500" />
                          )}
                          Toggle Theme
                        </button>

                        {encKey && (
                          <button
                            onClick={lockValut}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all duration-300 cursor-pointer"
                          >
                            <LockKeyhole className="w-4 h-4 text-emerald-500" />
                            Lock Vault
                          </button>
                        )}
                        <button
                          onClick={forwardToForgetPassword}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all duration-300 cursor-pointer"
                        >
                          <PencilLine className="w-4 h-4 text-blue-500" />
                          Change Password
                        </button>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2" />

                        <button
                          onClick={HandleLogOut}
                          className="cursor-pointer flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>

                        <button
                          onClick={handleResetVault}
                          className="cursor-pointer flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300"
                        >
                          <Eraser className="w-4 h-4" /> Reset Vault
                        </button>

                        <button
                          onClick={handleDeleteAccount}
                          className="cursor-pointer flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300"
                        >
                          <UserRoundX className="w-4 h-4" /> Delete Account
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
