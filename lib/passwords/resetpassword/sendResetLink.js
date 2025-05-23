import axios from "axios";

export const SendResetLink = async (email) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/forgotpassword`,
      { email }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to Send reset link"
    );
  }
};
