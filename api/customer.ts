import {
  AddCustomerProps,
  CustomerRating,
  CustomerTransaction,
  CustomerTrips,
  CustomerTripStat,
  CustomerWallet,
  GetCustomerParams,
  SingleCustomer,
  TeamMemberResponse,
  TeamStatResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getCustomerStat = async () => {
  const response = await axiosInstanceWithAuth.get<TeamStatResponse>(
    "admin/customers/stats",
  );
  return response.data;
};

export const getCustomer = async (params: GetCustomerParams = {}) => {
  const { page = 1, limit = 20, status, search } = params;

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (status && status !== "All") queryParams.set("status", status);
  if (search) queryParams.set("search", search);

  const response = await axiosInstanceWithAuth.get<
    ApiResponse<TeamMemberResponse>
  >(`admin/customers?${queryParams.toString()}`);
  return response.data;
};

export const addCustomer = async (
  values: AddCustomerProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    "admin/customers",
    values,
  );
  return response.data;
};

export const exportCustomersList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(`admin/customers/export`, {
    params: { format: typeMap[format] ?? format },
    responseType: "blob",
  });
  return response.data;
};

export const getSingleCustomer = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<SingleCustomer>(
    `admin/customers/${id}`,
  );
  return response.data;
};

export const editCustomer = async (
  id: string,
  values: AddCustomerProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.put<TeamMemberResponse>(
    `admin/customers/${id}`,
    values,
  );
  return response.data;
};

export const suspendCustomer = async (
  id: string,
  payload: { reason: string; duration_days: number; message: string },
) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/customers/${id}/suspend`,
    payload,
  );
  return response.data;
};

export const activateCustomer = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/customers/${id}/activate`,
  );
  return response.data;
};

export const resetPasswordCustomer = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/customers/${id}/reset-password/`,
  );
  return response.data;
};

export const getCustomerKYC = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<SingleCustomer>(
    `admin/customers/${id}/kyc`,
  );
  return response.data;
};
export const getCustomerTripStat = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<CustomerTripStat>(
    `admin/customers/${id}/trips/stats`,
  );
  return response.data;
};
export const getCustomerTrip = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<CustomerTrips>(
    `admin/customers/${id}/trips`,
  );
  return response.data;
};
export const getCustomerWallet = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<CustomerWallet>(
    `admin/customers/${id}/payments/wallet`,
  );
  return response.data;
};
export const getCustomerPaymentDetails = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<CustomerTransaction>(
    `admin/customers/${id}/payments`,
  );
  return response.data;
};
export const getCustomerRating = async (
  id: string,
  type: "GIVEN" | "RECEIVED",
) => {
  const response = await axiosInstanceWithAuth.get<CustomerRating>(
    `admin/customers/${id}/ratings`,
    { params: { type } },
  );
  return response.data;
};
