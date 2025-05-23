import axios from "axios";

export const handleSavePassword = async (data) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passwords/createpassword`, data);
    return res.data
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || "Something went wrong!");
  }
}
