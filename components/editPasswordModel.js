import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  TriangleAlert,
  AlertCircle,
  Cpu,
  Plus,
  Trash2,
  Info,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMasterPass } from "@/context/MasterPassword";
import { useRouter } from "next/navigation";
import categorizePassword from "@/lib/passwords/strengthChecker";
import { encryptV3 } from "@/lib/passwords/encryptPassV3";
import { capitalize, getPasswordStrength } from "@/lib/helper";
import PasswordGeneratorControls from "@/components/PasswordGeneratorControls";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const normalizeUsernames = (usernames = []) =>
  usernames
    .map((username) =>
      typeof username === "string" ? username.trim() : username.value?.trim(),
    )
    .filter(Boolean);

const areSameUsernames = (current, original) =>
  current.length === original.length &&
  current.every((username, index) => username === original[index]);

const EditModal = ({ onClose, onSave, editingData, noMasterPass }) => {
  const { masterPass, encKey } = useMasterPass();
  const router = useRouter();

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: {
      platform: editingData.platform,
      password: editingData.password,
      // usernames array --> [{value: "..."}, ...] format for useFieldArray
      usernames: (editingData.usernames ?? [""]).map((u) => ({ value: u })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "usernames",
    rules: { minLength: 1 },
  });

  const passwordValue = watch("password", "");
  const usernameValues = watch("usernames", []);
  const canAddMore =
    (usernameValues?.[usernameValues.length - 1]?.value ?? "").trim().length > 0;

  const entryStrength = useMemo(
    () => getPasswordStrength(passwordValue),
    [passwordValue],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [isPassSuggested, setIsPassSuggested] = useState(false);

  const handleSave = useCallback(
    async (data) => {
      if (!encKey) return noMasterPass();
      const currentUsernames = normalizeUsernames(data.usernames);
      const originalUsernames = normalizeUsernames(editingData.usernames);
      const hasActualChanges =
        data.platform !== editingData.platform ||
        data.password !== editingData.password ||
        !areSameUsernames(currentUsernames, originalUsernames);

      if (isDirty && hasActualChanges) {
        const strength = categorizePassword(data.password);
        const encryptedUsernames = await Promise.all(
          currentUsernames.map((u) => encryptV3(u, encKey)),
        );
        onSave({
          site: await encryptV3(data.platform, encKey),
          usernames: encryptedUsernames,
          password: await encryptV3(data.password, encKey),
          id: editingData.id,
          strength: await encryptV3(strength, encKey),
          version: 3,
        });
      } else {
        toast("No changes were made.", {
          icon: <Info className="w-5 h-5 text-gray-500" />,
        });
      }
      onClose();
    },
    [onSave, onClose, isDirty, masterPass, encKey, router, editingData],
  );

  const HandleSuggestStrongPassword = useCallback(
    (password) => {
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
    },
    [setValue],
  );

  const PasswordField = (
    <div className="group flex flex-col gap-2 items-start">
      <div className="relative w-full">
        <label
          htmlFor="edit-password"
          className="absolute -top-3 left-4 px-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transform transition-all duration-300 ease-in-out group-focus-within:-top-3 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500"
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
          className="peer w-full font-mono px-4 py-2.5 border-2 rounded-lg border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-transparent outline-none focus:border-blue-500 dark:focus:border-blue-400 transition duration-300 text-lg pr-10"
          aria-label="Password"
        />
        {showPassword ? (
          <EyeOff
            onClick={() => setShowPassword(false)}
            className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2
                          w-5 h-5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300
                          transition-all duration-300"
            role="button"
            aria-label="Hide password"
          />
        ) : (
          <Eye
            onClick={() => setShowPassword(true)}
            className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2
                          w-5 h-5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300
                          transition-all duration-300"
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

      <PasswordGeneratorControls
        isGenerated={isPassSuggested}
        onPassword={HandleSuggestStrongPassword}
        buttonClassName="w-full inline-flex items-center justify-center gap-2 px-2 md:px-4 py-2 rounded-md shadow-md text-nowrap bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 ease-in-out text-sm md:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        generatedButtonClassName="w-full inline-flex items-center justify-center gap-2 px-2 md:px-4 py-2 rounded-md shadow-md text-nowrap bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed transition-all duration-300 ease-in-out text-sm md:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      />
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center bg-gray-950/70 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-in-out">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`relative bg-white dark:bg-gray-800 px-4 pb-4 md:px-8 md:pb-8 pt-0 rounded-2xl shadow-2xl w-[95%] max-w-md md:max-w-3xl max-h-[95vh] animate-scale-in border-3 border-gray-200 dark:border-gray-700 overflow-auto scroll-bar-hide my-auto`}
      >
        <div className="sticky -top-2 md:-top-5 bg-white dark:bg-gray-800 z-1 pt-4 md:pt-8 flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Edit Password
          </h2>

          <X
            onClick={onClose}
            className="w-6 h-6 text-gray-500 dark:text-gray-400
                       hover:text-red-600 dark:hover:text-red-400
                       transition-colors duration-300 cursor-pointer"
            role="button"
            aria-label="Close modal"
          />
        </div>

        <form onSubmit={handleSubmit(handleSave)}>
          <div className="flex flex-col md:flex-row gap-5 font-inter">
            <div className="md:w-1/2 flex flex-col gap-5">
              <div className="relative group">
                <label
                  htmlFor="edit-platform"
                  className="absolute -top-3 left-4 px-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transform transition-all duration-300 ease-in-out group-focus-within:-top-3 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500"
                >
                  Site Name
                </label>
                <input
                  type="text"
                  id="edit-platform"
                  name="platform"
                  {...register("platform", { required: "Site is required!" })}
                  placeholder=" "
                  className="w-full px-4 py-2.5 border-2 rounded-lg  border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-transparent outline-none focus:border-blue-500 dark:focus:border-blue-400 transition duration-300 text-lg"
                  aria-label="Site Name"
                />
                {errors.platform && (
                  <p className="text-red-500 text-sm my-1 ml-1 flex items-center gap-1">
                    <TriangleAlert className="w-4 h-4" />
                    {errors.platform.message}
                  </p>
                )}
              </div>

              {/* Usernames â€” dynamic array */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Usernames / Emails
                  </label>
                  {canAddMore && (
                    <button
                      type="button"
                      onClick={() => append({ value: "" })}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add another
                    </button>
                  )}
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-1">
                    <div className="relative flex-1 group">
                      <input
                        type="text"
                        {...register(`usernames.${index}.value`, {
                          required:
                            index === 0
                              ? "At least one username is required!"
                              : false,
                        })}
                        placeholder={
                          index === 0
                            ? "Primary username / email"
                            : "Alternative username / ID"
                        }
                        className="w-full px-4 py-2.5 border-2 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition duration-300 text-base"
                      />
                      {errors.usernames?.[index]?.value && (
                        <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                          <TriangleAlert className="w-3 h-3" />
                          {errors.usernames[index].value.message}
                        </p>
                      )}
                    </div>
                    {/* Remove button */}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="shrink-0 px-1 py-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        aria-label="Remove username"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {fields.length <= 2 && PasswordField}
            </div>

            <div className="md:w-1/2 flex flex-col gap-5">
              {fields.length > 2 && PasswordField}
              <div
                className={`grid transition-all duration-300 ${passwordValue ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <div className="font-inter p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3 overflow-auto scroll-bar-hide mt-3 max-h-60">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-[12px] uppercase font-bold text-gray-800 dark:text-gray-200">
                        Security Score
                      </span>
                      <span
                        className={`text-[10px] md:text-[12px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${
                          entryStrength.score > 70
                            ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {entryStrength.category}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-[width] duration-500 ease-out ${
                          entryStrength.score > 75
                            ? "bg-emerald-500"
                            : entryStrength.score > 40
                              ? "bg-orange-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${entryStrength.score}%` }}
                      />
                    </div>

                    {entryStrength.result?.crack_times_display && (
                      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                        <p className="text-[10px] md:text-[12px] font-bold text-gray-800 dark:text-gray-100 uppercase flex items-center gap-1">
                          <Cpu className="w-3 h-3" /> Estimated Time to Crack
                        </p>

                        <div className="space-y-1">
                          {/* Scenario 1: Standard Hacker */}
                          <div className="flex gap-2 justify-between">
                            <span
                              className={`text-[12px] md:text-sm font-semibold ${entryStrength.score > 70 ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                            >
                              {capitalize(
                                entryStrength.result.crack_times_display
                                  .offline_slow_hashing_1e4_per_second,
                              )}
                            </span>
                            <span className="text-[10px] md:text-[12px] text-gray-700 dark:text-gray-200 italic text-nowrap">
                              (standard hacker, 10k guesses/sec)
                            </span>
                          </div>

                          {/* Scenario 2: Supercomputer (Hardcore Reality) */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-[12px] md:text-sm font-semibold text-blue-700 dark:text-blue-400">
                              {capitalize(
                                entryStrength.result.crack_times_display
                                  .offline_fast_hashing_1e10_per_second,
                              )}
                            </span>
                            <span className="text-[10px] md:text-[12px] text-gray-700 dark:text-gray-200 italic text-nowrap">
                              (supercomputer, 10B guesses/sec)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-5 items-center flex-wrap-reverse">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm md:text-base min-w-1/2 inline-flex items-center justify-center px-3 md:px-6 py-3 rounded-xl shadow-lg bg-gray-300 text-gray-800 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-red-700 transition-all duration-300 ease-in-out font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 text-sm text-nowrap md:text-base inline-flex items-center justify-center px-3 md:px-6 py-3 rounded-xl shadow-lg bg-linear-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:from-teal-600 dark:to-emerald-400 dark:hover:from-teal-700 dark:hover:to-emerald-500 transition-all duration-300 ease-in-out font-semibold transform hover:-translate-y-1"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  ,document.body);
};

export default memo(EditModal);
