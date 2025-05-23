import axios from "axios";

export async function handleEditPassword(data) {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passwords/editpassword`,
      data
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export async function handleToggleFavorite(passId, newStatus) {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passwords/editfavorite`,
      { isFav: newStatus, id: passId }
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
