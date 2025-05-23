'use client';
import { createContext, useContext, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const MasterPasswordContext = createContext(undefined);

export default function MasterPassProvider({ children }) {
  const [masterPass, setMasterPass] = useState(null);
  const timerRef = useRef(null);
  const router = useRouter();


  const resetMasterPass = useCallback(() => {
    setMasterPass(null);
    toast.error(
      "You've been inactive for a while. For your security, you need to re-enter your master password.",
      {
        style: {
          border: '1px solid #f87171',
          padding: '12px 16px',
          color: '#991b1b',
          background: '#fef2f2',
          fontSize: '15px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fef2f2',
        },
        duration: 5000,
      }
    );    
    setTimeout(() => {
      router.push('/dashboard');
    }, 5000);
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (masterPass) {
      timerRef.current = setTimeout(() => {
        resetMasterPass();
      }, 5 * 60 * 1000 - 5000); // 5 mins
    }
  }, [resetMasterPass, masterPass]);

  // Automatically reset timer when masterPass is set
  useEffect(() => {
    if (masterPass) resetTimer();
  }, [masterPass, resetTimer]);

  const value = useMemo(() => ({
    masterPass,
    setMasterPass,
    resetTimer,
  }), [masterPass, resetTimer, resetMasterPass]);

  return (
    <MasterPasswordContext.Provider value={value}>
      {children}
    </MasterPasswordContext.Provider>
  );
}

export function useMasterPass() {
  const context = useContext(MasterPasswordContext);
  if (context === undefined) {
    throw new Error('useMasterPass must be used within a MasterPassProvider');
  }
  return context;
}
