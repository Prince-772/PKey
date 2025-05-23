import axios from "axios";

export const VerifyMasterPass = async (masPass) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/user/verifyMasPass`,
      { masPass }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong!"
    );
  }
};
