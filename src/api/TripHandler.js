import axios from "axios";
import { BASEAPI_URL } from "../utils/constant";

export async function getTripBookingInfo(token) {
  try {
    const res = await axios({
      method: "GET",
      url: `${BASEAPI_URL}/api/TaxiType`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      return res.data.result;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateOperationState(token, status) {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${BASEAPI_URL}/api/DriverState/UpdatePartial`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        op: "replace",
        path: "/trangThai",
        value: status,
      },
    });
    if (res.status === 200) {
      return res.data.result;
    }
  } catch (error) {
    console.log(error);
  }
}
