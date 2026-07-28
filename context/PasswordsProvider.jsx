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
import { decryptV3, encryptV3 } from "@/lib/passwords/encryptPassV3";
import { decrypt } from "@/lib/passwords/oldencryptPassword";
import { UpdateToDV3 } from "@/lib/passwords/updatetonew/updatetonew";
import BlockedAccount from "@/components/BlockedAccountToast";

const PasswordsContext = createContext(undefined);

export default function PasswordsProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const { masterPass, setMasterPass, encKey, setEncKey, resetTimer } =
    useMasterPass();
  const { data: session, update, status } = useSession();

  const fetchPasswords = useCallback(async () => {
    if (status !== "authenticated") return;
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
      const deCryptedData = await Promise.all(
        getPasswords.map(async (p) => {
          // For Old Entries, Updaing to new
          if (p.version === 1) {
            let { userNames, siteName, strength } = p;
            // const userNamesV3 = await encryptV3(userName, encKey);
            const userNamesV3 = await Promise.all(
              userNames.map((username) => {
                return encryptV3(username, encKey);
              }),
            );
            const siteNameV3 = await encryptV3(siteName, encKey);
            const strengthV3 = await encryptV3(strength, encKey);
            const password = decrypt(p.password, masterPass); // Getting raw password
            const passwordV3 = await encryptV3(password, encKey); // Encrypting raw password to dv3 version
            const newData = {
              ...p,
              password: passwordV3,
              userNames: userNamesV3,
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
            // const userName = decrypt(p.userName, masterPass);
            const userNames = await Promise.all(
              p.userNames.map((username) => {
                return decrypt(username, masterPass);
              }),
            );
            const strength = decrypt(p.strength, masterPass);
            const password = decrypt(p.password, masterPass);
            const siteNameV3 = await encryptV3(siteName, encKey);
            // const userNameV3 = await encryptV3(userName, encKey);
            const userNamesV3 = await Promise.all(
              userNames.map((username) => {
                return encryptV3(username, encKey);
              }),
            );
            const strengthV3 = await encryptV3(strength, encKey);
            const passwordV3 = await encryptV3(password, encKey);

            const newData = {
              ...p,
              password: passwordV3,
              userNames: userNamesV3,
              siteName: siteNameV3,
              strength: strengthV3,
              version: 3,
            };

            oldDocs.push(newData);

            return {
              ...p,
              siteName,
              userNames,
              strength,
              password,
            };
          }
          // For dv3 Entries
          else {
            return {
              ...p,
              siteName: await decryptV3(p.siteName, encKey),
              // userName: await decryptV3(p.userName, encKey),
              userNames: await Promise.all(
                p.userNames.map((username) => decryptV3(username, encKey)),
              ),
              password: await decryptV3(p.password, encKey),
              strength: await decryptV3(p.strength, encKey),
            };
          }
        }),
      );
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
              return <BlockedAccount />;
            } else {
              return message || "Migration Failed, We'll try again later.";
            }
          },
        });
      }
    } catch (err) {
      toast.error(() => {
        if (err.message === "BLOCKED_ACCOUNT") {
          return <BlockedAccount />;
        } else {
          return (
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong"
          );
        }
      });
    } finally {
      setLoading(false);
      resetTimer();
    }
  }, [masterPass, encKey, status]);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  useEffect(() => {
    return () => {
      setEncKey(null);
    };
  }, []);

  const value = useMemo(
    () => ({
      loading,
      passwords,
      fetchPasswords,
    }),
    [passwords, loading, fetchPasswords],
  );

  return (
    <PasswordsContext.Provider value={value}>
      {children}
    </PasswordsContext.Provider>
  );
}

export function usePasswords() {
  const context = useContext(PasswordsContext);
  if (context === undefined) {
    throw new Error("usePasswords must be used within a PasswordsProvider.");
  }
  return context;
}
