import React, { memo, useCallback, useEffect, useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  Shield,
  TriangleAlert,
} from "lucide-react";
import { useForm } from "react-hook-form";
import SuggestPassword from "@/lib/passwords/suggestPassword";
import { encrypt } from "@/lib/passwords/encryptPassword";
import { useMasterPass } from "@/context/MasterPassword";
import { useRouter } from "next/navigation";
import categorizePassword from "@/lib/passwords/strengthChecker";

const EditModal = ({ onClose, onSave, editingData,noMasterPass }) => {
  const { masterPass } = useMasterPass();
  const router = useRouter();

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: editingData,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [isPassSuggested, setIsPassSuggested] = useState(false);

  const handleSave = useCallback(
    (data) => {
      if (!masterPass) return noMasterPass();
      const strength = categorizePassword(data.password);
      if (isDirty) {
        onSave({
          site: data.platform,
          username: data.username,
          password: encrypt(data.password, masterPass),
          id: editingData.id,
          strength,
        });
      }
      onClose();
    },
    [onSave, onClose, editingData.id, isDirty, masterPass, router]
  );

  const HandleSuggestStrongPassword = useCallback(() => {
    const password = SuggestPassword();
    if (password) {
      setValue("password", password, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setIsPassSuggested(true);
      setTimeout(() => {
        setIsPassSuggested(false);
      }, 2000);
    }
  }, [setValue]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-in-out">
      <div
        className={`bg-white dark:bg-gray-800 px-3 py-6 md:p-8 rounded-2xl shadow-2xl w-[95%] max-w-md relative
                         transform transition-transform duration-300 ease-in-out scale-100 opacity-100 animate-scaleIn
                         border border-gray-200 dark:border-gray-700`}
      >
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Edit Password
          </h2>

          <X
            onClick={onClose}
            className="w-6 h-6 text-gray-500 dark:text-gray-400
                       hover:text-red-600 dark:hover:text-red-400
                       transition-colors duration-200 cursor-pointer"
            role="button"
            aria-label="Close modal"
          />
        </div>

        <form onSubmit={handleSubmit(handleSave)}>
          <div className="flex flex-col gap-5 font-inter">
            <div className="relative group">
              <label
                htmlFor="edit-platform"
                className="absolute -top-3 left-4 px-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transform transition-all duration-200 ease-in-out group-focus-within:top-[-0.75rem] group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500"
              >
                Site Name
              </label>
              <input
                type="text"
                id="edit-platform"
                name="platform"
                {...register("platform", { required: "Site is required!" })}
                placeholder=" "
                className="w-full px-4 py-2.5 border-2 rounded-lg  border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-transparent outline-none focus:border-blue-500 dark:focus:border-blue-400 transition duration-200 text-lg"
                aria-label="Site Name"
              />
              {errors.platform && (
                <p className="text-red-500 text-sm my-1 ml-1 flex items-center gap-1">
                  <TriangleAlert className="w-4 h-4" />
                  {errors.platform.message}
                </p>
              )}
            </div>

            <div className="relative group">
              <label
                htmlFor="edit-username"
                className="absolute -top-3 left-4 px-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transform transition-all duration-200 ease-in-out group-focus-within:top-[-0.75rem] group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500"
              >
                Username
              </label>
              <input
                type="text"
                id="edit-username"
                name="username"
                {...register("username", { required: "Username is required!" })}
                placeholder=" "
                className="peer w-full px-4 py-2.5 border-2 rounded-lg border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-transparent outline-none focus:border-blue-500 dark:focus:border-blue-400 transition duration-200 text-lg"
                aria-label="Username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm my-1 ml-1 flex items-center gap-1">
                  <TriangleAlert className="w-4 h-4" />
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="group flex flex-col gap-2 items-start">
              <div className="relative w-full">
                <label
                  htmlFor="edit-password"
                  className="absolute -top-3 left-4 px-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transform transition-all duration-200 ease-in-out group-focus-within:top-[-0.75rem] group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="edit-password"
                  name="password"
                  {...register("password", {
                    required: "Password is required!",
                  })}
                  placeholder=" "
                  className="peer w-full font-mono px-4 py-2.5 border-2 rounded-lg border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-transparent outline-none focus:border-blue-500 dark:focus:border-blue-400 transition duration-200 text-lg pr-10"
                  aria-label="Password"
                />
                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword(false)}
                    className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2
                          w-5 h-5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300
                          transition-all duration-200"
                    role="button"
                    aria-label="Hide password"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2
                          w-5 h-5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300
                          transition-all duration-200"
                    role="button"
                    aria-label="Show password"
                  />
                )}
                {errors.password && (
                  <p className="text-red-500 text-sm my-1 ml-1 flex items-center gap-1">
                    <TriangleAlert className="w-4 h-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={HandleSuggestStrongPassword}
                disabled={isPassSuggested}
                className={`inline-flex items-center gap-2 px-2 md:px-4 py-2 rounded-md shadow-md text-nowrap
                              ${
                                isPassSuggested
                                  ? "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
                              }
                              transition-all duration-300 ease-in-out text-sm md:text-base font-semibold
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {isPassSuggested ? (
                  <ShieldCheck
                    className={`w-5 h-5 ${
                      isPassSuggested ? "text-gray-500 dark:text-gray-400" : ""
                    }`}
                  />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
                Suggest Strong Password
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-5 items-center">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm md:text-base inline-flex items-center justify-center px-3 md:px-6 py-3 rounded-xl shadow-lg bg-gray-300 text-gray-800 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-red-700 transition-all duration-300 ease-in-out font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 text-sm text-nowrap md:text-base inline-flex items-center justify-center px-3 md:px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:from-teal-600 dark:to-emerald-400 dark:hover:from-teal-700 dark:hover:to-emerald-500 transition-all duration-300 ease-in-out font-semibold transform hover:-translate-y-1"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(EditModal);
