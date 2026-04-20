import axios from "axios";

export async function UpdateToDV3(dataArray) {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/protected/passwords/updatetodv3`,
      {newDocArray: dataArray},
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
