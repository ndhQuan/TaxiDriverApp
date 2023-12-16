import axios from "axios";
import { BASEAPI_URL } from "../utils/constant";

export async function updateRealTimeLocation(token, driverId, driverLocation) {
  try {
    const res = await axios({
      method: "PUT",
      url: `${BASEAPI_URL}/api/DriverState/${driverId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        ...driverLocation,
      },
    });
    if (res.status === 200) {
      return res.data.result;
    }
  } catch (error) {
    console.log(error);
  }
}
