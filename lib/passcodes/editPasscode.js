import axios from "axios";

export async function handleEditPasscode(data) {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passcodes/edit`,
      data,
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update passcode.",
    );
  }
}

export async function handleTogglePasscodeFavorite(passcodeId, newStatus) {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passcodes/editfavorite`,
      { isFav: newStatus, id: passcodeId },
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update favorite status.",
    );
  }
}
