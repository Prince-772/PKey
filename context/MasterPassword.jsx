"use client";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { hasMasterPass } from "@/lib/masterpassword/hasMasterPassword";

const MasterPasswordContext = createContext(undefined);

export default function MasterPassProvider({ children }) {
  const [masterPass, setMasterPass] = useState(null);
  const [encKey, setEncKey] = useState(null);
  const { status } = useSession();
  const [masterPassSet, setMasterPassSet] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        try {
          const res = await hasMasterPass();
          if (!res) setMasterPassSet(true);
        } catch (err) {}
      })();
    }
  }, [status]);

  const clearMasterPass = useCallback(() => {
    setMasterPass(null);
    setEncKey(null);
    toast(
      "You've been inactive for a while. For your security, you need to re-enter your master password.",
      {
        style: {
          border: "1px solid #fbbf24",
          padding: "12px 16px",
          color: "#92400e",
          background: "#fefce8",
          fontSize: "15px",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#facc15",
          secondary: "#fefce8",
        },
        duration: 4000,
        removeDelay: 1000,
      },
    );
  }, []);

  const resetTimer = useCallback(() => {
    if (!encKey) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(
      () => {
        clearMasterPass();
      },
      5 * 60 * 1000, // 5 mins
      // 10000, // 10 seconds
    );
  }, [clearMasterPass, masterPass, encKey]);

  // Automatically reset timer when encKey changes
  useEffect(() => {
    resetTimer();
  }, [masterPass, encKey, resetTimer]);

  const value = useMemo(
    () => ({
      masterPass,
      setMasterPass,
      encKey,
      setEncKey,
      resetTimer,
      masterPassSet,
      setMasterPassSet,
    }),
    [masterPass, encKey, resetTimer, masterPassSet],
  );

  return (
    <MasterPasswordContext.Provider value={value}>
      {children}
    </MasterPasswordContext.Provider>
  );
}

export function useMasterPass() {
  const context = useContext(MasterPasswordContext);
  if (context === undefined) {
    throw new Error("useMasterPass must be used within a MasterPassProvider");
  }
  return context;
}
