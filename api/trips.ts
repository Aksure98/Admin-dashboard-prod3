import {
  ForceEndRideProps,
  GetTripsParams,
  ReassignRideProps,
  TeamMemberResponse,
  TripsListResponse,
  TripStatResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getTrips = async (params?: GetTripsParams) => {
  const response = await axiosInstanceWithAuth.get<TripsListResponse>(
    "admin/trips",
    { params },
  );
  return response.data;
};

export const getTripsStat = async (params?: {
  service_type?: string;
  state?: string;
}) => {
  const response = await axiosInstanceWithAuth.get<TripStatResponse>(
    "admin/trips/stats",
    { params },
  );
  return response.data;
};

export const getAvailableDrivers = async ({ booking_id = "" }) => {
  const response = await axiosInstanceWithAuth.get(
    "admin/trips/available-operators?service_type=RIDES",
    {
      params: { booking_id },
    },
  );
  return response.data;
};
export const getSingleTrip = async (id: string) => {
  const response = await axiosInstanceWithAuth.get(`admin/trips/${id}`);
  return response.data;
};

export const reassignRides = async (
  id: string,
  values: ReassignRideProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/trips/${id}/reassign-driver`,
    values,
  );
  return response.data;
};
export const forceEndRides = async (
  id: string,
  values: ForceEndRideProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/trips/${id}/force-end`,
    values,
  );
  return response.data;
};
