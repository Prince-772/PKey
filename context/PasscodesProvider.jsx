"use client";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useMasterPass } from "./MasterPassword";
import axios from "axios";
import { decryptV3 } from "@/lib/passwords/encryptPassV3";
import BlockedAccount from "@/components/BlockedAccountToast";

const PasscodesContext = createContext(undefined);

async function decryptOrFallback(value, encKey, fallback = value) {
  if (!value) return fallback;

  try {
    return await decryptV3(value, encKey);
  } catch {
    return fallback;
  }
}

export default function PasscodesProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [passcodes, setPasscodes] = useState([]);
  const { encKey, resetTimer, setEncKey } = useMasterPass();
  const { status } = useSession();

  const fetchPasscodes = useCallback(async () => {
    if (status !== "authenticated" || !encKey) {
      if (passcodes.length > 0) setPasscodes([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passcodes/getall`
      );
      const getPasscodes = res.data.data;

      const deCryptedData = await Promise.all(
        getPasscodes.map(async (p) => {
          return {
            ...p,
            siteName: await decryptOrFallback(p.siteName, encKey),
            userNames: await Promise.all(
              (p.userNames ?? []).map((u) => decryptOrFallback(u, encKey))
            ),
            pin: await decryptOrFallback(p.pin, encKey),
            strength: await decryptOrFallback(
              p.strength,
              encKey,
              p.strength || "moderate"
            ),
          };
        })
      );
      setPasscodes(deCryptedData);
    } catch (err) {
      toast.error(() => {
        if (err?.response?.data?.message === "BLOCKED_ACCOUNT") {
          return <BlockedAccount />;
        } else {
          return (
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong fetching passcodes"
          );
        }
      });
    } finally {
      setLoading(false);
      resetTimer();
    }
  }, [encKey, status, resetTimer]);

  useEffect(() => {
    fetchPasscodes();
  }, [fetchPasscodes]);

    useEffect(() => {
    return () => {
      setEncKey(null);
    };
  }, []);

  const value = useMemo(
    () => ({
      loading,
      passcodes,
      fetchPasscodes,
    }),
    [passcodes, loading, fetchPasscodes]
  );

  return (
    <PasscodesContext.Provider value={value}>
      {children}
    </PasscodesContext.Provider>
  );
}

export function usePasscodes() {
  const context = useContext(PasscodesContext);
  if (context === undefined) {
    throw new Error("usePasscodes must be used within a PasscodesProvider.");
  }
  return context;
}
