import axios from "axios";

export const VerifyTokenDeleteAccount = async (token) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/user/getEmail-delete-account`,
      { token }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to verify token"
    );
  }
};
