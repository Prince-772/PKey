import axios from "axios";

export async function handleDeletePassword(id) {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passwords/deletepassword`,
      { data: { id } }
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
