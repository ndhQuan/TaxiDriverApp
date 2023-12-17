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

export async function getTaxiTypeInfo(token, id) {
  try {
    const res = await axios({
      method: "GET",
      url: `${BASEAPI_URL}/api/TaxiType/4`,
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

export async function CreateJourney(journeyInfo, token) {
  try {
    const res = await axios({
      method: "POST",
      url: `${BASEAPI_URL}/api/Journey`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        ...journeyInfo,
      },
    });
    if (res.status === 201) {
      return res.data.result;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getDriverState(driverId, token) {
  try {
    const res = await axios({
      method: "GET",
      url: `${BASEAPI_URL}/api/DriverState/${driverId}`,
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

export async function updateOperationState(token, id, status) {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${BASEAPI_URL}/api/DriverState/UpdatePartial/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: [
        {
          op: "replace",
          path: "/trangThai",
          value: status,
        },
      ],
    });
    if (res.status === 204) {
      return res.data.result;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateJourneyState(token, id, path, value) {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${BASEAPI_URL}/api/Journey/UpdatePartial/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: [
        {
          op: "replace",
          path: `/${path}`,
          value: value,
        },
      ],
    });
    if (res.status === 200) {
      return res.data.result;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getJourneyLog(token, id, isCustomer) {
  try {
    const res = await axios({
      method: "GET",
      url: `${BASEAPI_URL}/api/Journey?id=${id}&isCustomer=${isCustomer}`,
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
