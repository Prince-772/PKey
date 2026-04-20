import axios from "axios";

export async function handleResetVaultEmailSend(password) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/user/reset-vault-email`,{ password });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
