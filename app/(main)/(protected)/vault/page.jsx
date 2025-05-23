"use client"
import { useMasterPass } from "@/context/MasterPassword";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Vault = () => {
  const { masPass } = useMasterPass()
  const router = useRouter()
  useEffect(() => {
    if(!masPass) router.push("/masterPass")
  },[masPass,router])
  return (
    <></>
  )
};

export default Vault;
