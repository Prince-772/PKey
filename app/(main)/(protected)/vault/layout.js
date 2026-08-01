"use client";
import CreateMasterPasswordModal from "@/components/CreateMasterPassword";
import MasterPasswordModel from "@/components/MasterPasswordModal";
import Sidebar from "@/components/vault/Sidebar";
import { useMasterPass } from "@/context/MasterPassword";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";

const VaultLayout = ({ children, passwords }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const {
    showMasterPassModel,
    setShowMasterPassModel,
    showCreateMasterModel,
    setShowCreateMasterModel,
    setMasterPass,
    encKey,
    setEncKey
  } = useMasterPass();
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

  return (
    <div className="mt-20">
      <main className="flex gap-4">
        {/* Modals */}
        {showMasterPassModel && (
          <MasterPasswordModel
            isOpen={showMasterPassModel}
            onClose={() => setShowMasterPassModel(false)}
          />
        )}
        {showCreateMasterModel && (
          <CreateMasterPasswordModal
            isOpen={showCreateMasterModel}
            onClose={() => setShowCreateMasterModel(false)}
          />
        )}
        <Suspense fallback={null}>
          <Sidebar
            expanded={sidebarExpanded}
            onExpandChange={setSidebarExpanded}
            onLockVault={handleLockVault}
            onLogOut={handleLogOut}
            encKey={encKey}
          />
        </Suspense>

        {/* <div className="fixed right-0 top-0 mt-16 z-10 flex h-screen"> */}
        <div
          key={pathname}
          className={`fixed top-18 right-0 bottom-0 overflow-y-auto transition-all duration-300 ease-in-out scroll-bar-hide pb-15 md:pb-0
              ${sidebarExpanded ? "left-0 md:left-18 lg:left-64" : "left-0 md:left-18"}`}
        >
          <Suspense fallback={null}>{passwords}</Suspense>
          {children}
        </div>
      </main>
    </div>
  );
};
export default VaultLayout;

// export const metadata = {
//   title: "Vault - PKey",
//   description: "Access, add, edit, and manage your encrypted passwords in your personal vault.",
//   keywords: [
//     "password vault",
//     "encrypted passwords",
//     "password manager",
//     "manage passwords",
//     "PKey vault",
//     "secure password storage"
//   ],
// };
