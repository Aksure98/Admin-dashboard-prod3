import {
  AddOperatorProps,
  ComposeNotificationsProps,
  DocumentResponseList,
  DriversDocumentParams,
  DriversWalletParams,
  EarningsOverviewResponse,
  EditProps,
  GetDriverParams,
  GetNotificationParams,
  GetTripsParams,
  NotificationResponse,
  OperatorEarningsResponse,
  OperatorMemberResponse,
  OperatorPerformanceResponse,
  OperatorResponseList,
  OperatorStatResponse,
  SingleDriverTrips,
  SingleOperatorResponse,
  TeamMemberResponse,
  TripsListResponse,
  TripsParams,
  TripStatResponse,
  TripStatsResponse,
  VehicleInfoResponse,
  WalletResponseList,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const addTowMember = async (
  values: AddOperatorProps,
): Promise<OperatorMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<OperatorMemberResponse>(
    "admin/operators/TOWING",
    values,
  );
  return response.data;
};

export const editTow = async (
  id: string,
  values: AddOperatorProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.put<TeamMemberResponse>(
    `admin/operators/${id}`,
    values,
  );
  return response.data;
};

export const getTowStat = async () => {
  const response = await axiosInstanceWithAuth.get<OperatorStatResponse>(
    "admin/operators/TOWING/stats",
  );
  return response.data;
};

export const getTowList = async (params: GetDriverParams = {}) => {
  const { page = 1, limit = 20, search, verification_status, status } = params;

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));

  if (status && status !== "ALL") queryParams.set("status", status);
  if (search) queryParams.set("search", search);
  if (verification_status)
    queryParams.set("verification_status", verification_status);

  const response = await axiosInstanceWithAuth.get<
    ApiResponse<TeamMemberResponse>
  >(`admin/operators/TOWING?${queryParams.toString()}`);

  return response.data;
};

export const exportTowList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    "admin/operators/TOWING/export",
    {
      params: { format: typeMap[format] ?? format },
      responseType: "blob",
    },
  );
  return response.data;
};

export const towLocationList = async (availability_status: string) => {
  const response = await axiosInstanceWithAuth.get<OperatorResponseList>(
    "admin/operators/TOWING/locations",
    {
      params: { availability_status },
    },
  );
  return response.data;
};

export const getTowNotification = async (params?: GetNotificationParams) => {
  const response = await axiosInstanceWithAuth.get<NotificationResponse>(
    "admin/operators/TOWING/notifications",
    { params },
  );
  return response.data;
};

export const addTowNotification = async (
  values: ComposeNotificationsProps,
): Promise<OperatorMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<OperatorMemberResponse>(
    "admin/operators/TOWING/notifications",
    values,
  );
  return response.data;
};

export const towWallet = async (params?: DriversWalletParams) => {
  const response = await axiosInstanceWithAuth.get<WalletResponseList>(
    "admin/operators/TOWING/wallets",
    { params },
  );
  return response.data;
};

export const exportTowWalletList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    "admin/operators/TOWING/wallets/export",
    {
      params: { format: typeMap[format] ?? format },
      responseType: "blob",
    },
  );
  return response.data;
};

export const towDocument = async (params?: DriversDocumentParams) => {
  const response = await axiosInstanceWithAuth.get<DocumentResponseList>(
    "admin/operators/TOWING/documents",
    { params },
  );
  return response.data;
};

export const getSingleTow = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<SingleOperatorResponse>(
    `admin/operators/${id}`,
  );
  return response.data;
};

export const suspendTow = async (
  id: string,
  payload: { reason: string; duration_days: number; message: string },
) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/suspend`,
    payload,
  );
  return response.data;
};

export const activateTow = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/activate`,
  );
  return response.data;
};

export const resetPasswordTow = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/reset-password/`,
  );
  return response.data;
};

export const getTowVehicle = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<VehicleInfoResponse>(
    `admin/operators/${id}/vehicle`,
  );
  return response.data;
};

export const editTowVehicle = async (
  id: string,
  values: EditProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.put<TeamMemberResponse>(
    `admin/operators/${id}/vehicle`,
    values,
  );
  return response.data;
};

export const getTowPerformance = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<OperatorPerformanceResponse>(
    `admin/operators/${id}/performance`,
  );
  return response.data;
};

export const getTowTripsStats = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<TripStatsResponse>(
    `admin/operators/${id}/trips/stats`,
  );
  return response.data;
};

export const getTowTripsList = async (id: string, params?: TripsParams) => {
  const response = await axiosInstanceWithAuth.get<SingleDriverTrips>(
    `admin/operators/${id}/trips?service_type=TOWING`,
    { params },
  );
  return response.data;
};

export const getTowEarning = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<EarningsOverviewResponse>(
    `admin/operators/${id}/earnings/stats`,
  );
  return response.data;
};

export const getTowEarningList = async (id: string, params?: TripsParams) => {
  const response = await axiosInstanceWithAuth.get<OperatorEarningsResponse>(
    `admin/operators/${id}/earnings`,
    { params },
  );
  return response.data;
};

export const rejectTowDocument = async (id: string, doc_id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/documents/${doc_id}/reject`,
  );
  return response.data;
};

export const approveTowDocument = async (id: string, doc_id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/documents/${doc_id}/approve`,
  );
  return response.data;
};

export const getTowTrips = async (params?: GetTripsParams) => {
  const response = await axiosInstanceWithAuth.get<TripsListResponse>(
    "admin/trips?service_type=TOWING",
    { params },
  );
  return response.data;
};

export const getTowTripStat = async () => {
  const response = await axiosInstanceWithAuth.get<TripStatResponse>(
    "admin/trips/stats?service_type=TOWING",
  );
  return response.data;
};

export const getAvailableTowOperatorsForTrip = async ({
  booking_id = "",
}: {
  booking_id?: string;
}) => {
  const response = await axiosInstanceWithAuth.get(
    "admin/trips/available-operators?service_type=TOWING",
    {
      params: { booking_id },
    },
  );
  return response.data;
};
