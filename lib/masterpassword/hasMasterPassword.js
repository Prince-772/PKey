import axios from "axios";

export const hasMasterPass = async () => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/user/hasMasterPass`);
    return res.data.hasMasterPass
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || "Something went wrong!");
  }
}
