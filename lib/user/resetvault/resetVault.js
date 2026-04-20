import axios from "axios";

export const ResetVault = async (token) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/user/reset-vault-final`,
      {
        data: { token },
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to verify token",
    );
  }
};
