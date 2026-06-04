import { GetTripsParams, TripsListResponse, TripStatResponse } from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getDelivery = async (params?: GetTripsParams) => {
  const response = await axiosInstanceWithAuth.get<TripsListResponse>(
    "admin/trips?service_type=DELIVERY",
    { params },
  );
  return response.data;
};

export const getDeliveryStat = async () => {
  const response = await axiosInstanceWithAuth.get<TripStatResponse>(
    "admin/trips/stats?service_type=DELIVERY",
  );
  return response.data;
};

export const getAvailableDelivery = async ({ booking_id = "" }) => {
  const response = await axiosInstanceWithAuth.get(
    "admin/trips/available-operators?service_type=DELIVERY",
    {
      params: { booking_id },
    },
  );
  return response.data;
};
