import axios from "axios";

export const VerifyToken = async (token) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/getEmail`,
      { token }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || error.message || "Failed to verify token"
    );
  }
};
