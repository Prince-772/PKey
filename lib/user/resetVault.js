import axios from "axios";

export async function handleResetVault(password) {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/user/reset-vault`,{ data: { password } });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
