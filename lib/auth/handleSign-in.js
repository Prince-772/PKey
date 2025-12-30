import { signIn } from "next-auth/react";

export const HandleSignIn = async ({ emailOrUsername, password }) => {
  const res = await signIn("credentials", {
    email: emailOrUsername.trim(),
    password,
    redirect: false,
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  return res;
};
