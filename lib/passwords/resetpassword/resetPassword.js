import axios from "axios";

export const ResetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/resetPassword`,
      { token, newPassword, confirmPassword }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to verify token"
    );
  }
};
