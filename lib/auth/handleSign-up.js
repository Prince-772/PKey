import axios from "axios";

export const HandleSignUp = async (data) => {
  try {
    const res = await axios.post("/api/auth/signup", data);
    return res;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to sign up";
    throw new Error(message);
  }
};
