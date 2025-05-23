"use client";
import CreateMasterPasswordModal from "@/components/CreateMasterPassword";
import { CreateMasterPass } from "@/lib/masterpassword/create";
import { hasMasterPass } from "@/lib/masterpassword/hasMasterPassword";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const { status } = useSession();
  const [showCreateMasterModel, setShowCreateMasterModel] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        const res = await hasMasterPass();
        console.log(res);
        if (!res) setShowCreateMasterModel(true);
      })();
    }
  }, [status]);

  const onCreateMasterPass = useCallback(async (masterPass) => {
    await toast.promise(CreateMasterPass(masterPass), {
      loading: "Saving Securily...",
      success: (res) => {
        setShowCreateMasterModel(false)
        return res.message || "Master Password created!"
      },
      error: (err) => err.message || "Unable to create master password",
    });
  },[]);

  return (
    <>
      <Toaster />
      <CreateMasterPasswordModal
        {...{
          isOpen: showCreateMasterModel,
          onClose: () => setShowCreateMasterModel(false),
          onSetMasterPassword: onCreateMasterPass,
        }}
      />
    </>
  );
};

export default Page;
