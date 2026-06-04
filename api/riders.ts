import {
  ComposeNotificationsProps,
  DocumentResponseList,
  DriversDocumentParams,
  DriversWalletParams,
  AddRiderProps,
  RiderMemberResponse,
  GetNotificationParams,
  NotificationResponse,
  OperatorMemberResponse,
  OperatorResponseList,
  TeamMemberResponse,
  GetDriverParams,
  SingleOperatorResponse,
  OperatorStatResponse,
  WalletResponseList,
  EarningsOverviewResponse,
  EditProps,
  OperatorEarningsResponse,
  OperatorPerformanceResponse,
  SingleDriverTrips,
  TripsParams,
  TripStatsResponse,
  VehicleInfoResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const addRiderMember = async (
  values: AddRiderProps,
): Promise<RiderMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<RiderMemberResponse>(
    "api/admin/add-rider",
    values,
  );
  return response.data;
};

export const editRider = async (
  id: string,
  values: AddRiderProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.put<TeamMemberResponse>(
    `admin/operators/${id}`,
    values,
  );
  return response.data;
};

export const getRiderStat = async () => {
  const response = await axiosInstanceWithAuth.get<OperatorStatResponse>(
    "admin/operators/DELIVERY/stats",
  );
  return response.data;
};

export const getRidersList = async (params: GetDriverParams = {}) => {
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
  >(`admin/operators/DELIVERY?${queryParams.toString()}`);

  return response.data;
};

export const exportRiderList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    `admin/operators/DELIVERY/export`,
    {
      params: { format: typeMap[format] ?? format },
      responseType: "blob",
    },
  );
  return response.data;
};

export const riderLocationList = async (availability_status: string) => {
  const response = await axiosInstanceWithAuth.get<OperatorResponseList>(
    "admin/operators/DELIVERY/locations",
    {
      params: { availability_status },
    },
  );
  return response.data;
};

export const getRidersNotification = async (params?: GetNotificationParams) => {
  const response = await axiosInstanceWithAuth.get<NotificationResponse>(
    "admin/operators/DELIVERY/notifications",
    { params },
  );
  return response.data;
};

export const addNotification = async (
  values: ComposeNotificationsProps,
): Promise<OperatorMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<OperatorMemberResponse>(
    "admin/operators/DELIVERY/notifications",
    values,
  );
  return response.data;
};

export const ridersWallet = async (params?: DriversWalletParams) => {
  const response = await axiosInstanceWithAuth.get<WalletResponseList>(
    "admin/operators/DELIVERY/wallets",
    { params },
  );
  return response.data;
};

export const exportRidersWalletList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    `admin/operators/DELIVERY/wallets/export`,
    {
      params: { format: typeMap[format] ?? format },
      responseType: "blob",
    },
  );
  return response.data;
};

export const ridersDocument = async (params?: DriversDocumentParams) => {
  const response = await axiosInstanceWithAuth.get<DocumentResponseList>(
    "admin/operators/DELIVERY/documents",
    { params },
  );
  return response.data;
};

export const getSingleRider = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<SingleOperatorResponse>(
    `admin/operators/${id}`,
  );
  return response.data;
};

export const suspendRider = async (
  id: string,
  payload: { reason: string; duration_days: number; message: string },
) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/suspend`,
    payload,
  );
  return response.data;
};

export const activateRider = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/activate`,
  );
  return response.data;
};

export const resetPasswordRider = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/reset-password/`,
  );
  return response.data;
};

export const getVehicle = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<VehicleInfoResponse>(
    `admin/operators/${id}/vehicle`,
  );
  return response.data;
};

export const editVehicle = async (
  id: string,
  values: EditProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.put<TeamMemberResponse>(
    `admin/operators/${id}/vehicle`,
    values,
  );
  return response.data;
};

export const getPerformance = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<OperatorPerformanceResponse>(
    `admin/operators/${id}/performance`,
  );
  return response.data;
};

export const getTripsStats = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<TripStatsResponse>(
    `admin/operators/${id}/trips/stats`,
  );
  return response.data;
};

export const getTripsList = async (id: string, params?: TripsParams) => {
  const response = await axiosInstanceWithAuth.get<SingleDriverTrips>(
    `admin/operators/${id}/trips?service_type=DELIVERY`,
    { params },
  );
  return response.data;
};

export const getEarning = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<EarningsOverviewResponse>(
    `admin/operators/${id}/earnings/stats`,
  );
  return response.data;
};

export const getEarningList = async (id: string, params?: TripsParams) => {
  const response = await axiosInstanceWithAuth.get<OperatorEarningsResponse>(
    `admin/operators/${id}/earnings`,
    { params },
  );
  return response.data;
};

export const rejectDocument = async (id: string, doc_id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/documents/${doc_id}/reject`,
  );
  return response.data;
};

export const approveDocument = async (id: string, doc_id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/documents/${doc_id}/approve`,
  );
  return response.data;
};
