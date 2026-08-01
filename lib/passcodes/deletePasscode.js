import axios from "axios";

export async function handleDeletePasscode(id) {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passcodes/delete`,
      { data: { id } }
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}
