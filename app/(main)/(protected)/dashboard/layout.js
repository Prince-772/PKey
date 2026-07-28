"use client";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useMasterPass } from "@/context/MasterPassword";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children, createpassword, user }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { setMasterPass, setEncKey } = useMasterPass();
  const router = useRouter();
  const pathname = usePathname();

  const handleLockVault = () => {
    setEncKey(null);
    setMasterPass(null);
  };

  const handleLogOut = async () => {
    await signOut({ redirect: false });
    setMasterPass(null);
    setEncKey(null);
    router.push("/");
  };
  const tabRoutes = ["/dashboard", "/dashboard/add", "/dashboard/security"];

  return (
    <div className="mt-20">
      <main className="flex gap-4">
        <div className="fixed md:left-0 md:top-0 md:pt-16 z-5 flex md:h-screen">
          <Sidebar
            expanded={sidebarExpanded}
            onExpandChange={setSidebarExpanded}
            onLockVault={handleLockVault}
            onLogOut={handleLogOut}
          />
        </div>

        {/* <div className="fixed right-0 top-0 mt-16 z-10 flex h-screen"> */}
        <div
          key={pathname}
          className={`fixed top-18 right-0 bottom-0 px-4 md:px-6 lg:px-8 overflow-y-auto transition-all duration-300 ease-in-out scroll-bar-hide pb-15 md:pb-0
        ${sidebarExpanded ? "left-0 md:left-18 lg:left-64" : "left-0 md:left-18"}`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
// export const metadata = {
//   title: "Dashboard - PKey",
//   description:
//     "Manage your account, vault, and preferences securely from your PKey dashboard.",
//   keywords: [
//     "password manager dashboard",
//     "manage vault",
//     "account settings",
//     "PKey user dashboard",
//     "secure password management",
//   ],
// };
