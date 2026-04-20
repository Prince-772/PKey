import axios from "axios";

export async function AutoMigrateToUv2(newHash, salt) {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/user/migratetov2`,
      {authHash: newHash, salt},
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
