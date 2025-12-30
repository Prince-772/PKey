import axios from "axios";

export const HandleSignUp = async (data) => {
  const { name, email, password, confirmPassword } = data
  try {
    const res = await axios.post("/api/auth/signup", { name, email:email.trim(), password, confirmPassword });
    return res;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to sign up";
    throw new Error(message);
  }
};
