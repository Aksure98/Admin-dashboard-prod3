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

export const addCargoMember = async (
  values: AddOperatorProps,
): Promise<OperatorMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<OperatorMemberResponse>(
    "admin/operators/TRUCK",
    values,
  );
  return response.data;
};

export const editCargo = async (
  id: string,
  values: AddOperatorProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.put<TeamMemberResponse>(
    `admin/operators/${id}`,
    values,
  );
  return response.data;
};

export const getCargoStat = async () => {
  const response = await axiosInstanceWithAuth.get<OperatorStatResponse>(
    "admin/operators/TRUCK/stats",
  );
  return response.data;
};

export const getCargoList = async (params: GetDriverParams = {}) => {
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
  >(`admin/operators/TRUCK?${queryParams.toString()}`);

  return response.data;
};

export const exportCargoList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    "admin/operators/TRUCK/export",
    {
      params: { format: typeMap[format] ?? format },
      responseType: "blob",
    },
  );
  return response.data;
};

export const cargoLocationList = async (availability_status: string) => {
  const response = await axiosInstanceWithAuth.get<OperatorResponseList>(
    "admin/operators/TRUCK/locations",
    {
      params: { availability_status },
    },
  );
  return response.data;
};

export const getCargoNotification = async (params?: GetNotificationParams) => {
  const response = await axiosInstanceWithAuth.get<NotificationResponse>(
    "admin/operators/TRUCK/notifications",
    { params },
  );
  return response.data;
};

export const addCargoNotification = async (
  values: ComposeNotificationsProps,
): Promise<OperatorMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<OperatorMemberResponse>(
    "admin/operators/TRUCK/notifications",
    values,
  );
  return response.data;
};

export const cargoWallet = async (params?: DriversWalletParams) => {
  const response = await axiosInstanceWithAuth.get<WalletResponseList>(
    "admin/operators/TRUCK/wallets",
    { params },
  );
  return response.data;
};

export const exportCargoWalletList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    "admin/operators/TRUCK/wallets/export",
    {
      params: { format: typeMap[format] ?? format },
      responseType: "blob",
    },
  );
  return response.data;
};

export const cargoDocument = async (params?: DriversDocumentParams) => {
  const response = await axiosInstanceWithAuth.get<DocumentResponseList>(
    "admin/operators/TRUCK/documents",
    { params },
  );
  return response.data;
};

export const getSingleCargo = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<SingleOperatorResponse>(
    `admin/operators/${id}`,
  );
  return response.data;
};

export const suspendCargo = async (
  id: string,
  payload: { reason: string; duration_days: number; message: string },
) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/suspend`,
    payload,
  );
  return response.data;
};

export const activateCargo = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/activate`,
  );
  return response.data;
};

export const resetPasswordCargo = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/reset-password/`,
  );
  return response.data;
};

export const getCargoVehicle = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<VehicleInfoResponse>(
    `admin/operators/${id}/vehicle`,
  );
  return response.data;
};

export const editCargoVehicle = async (
  id: string,
  values: EditProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.put<TeamMemberResponse>(
    `admin/operators/${id}/vehicle`,
    values,
  );
  return response.data;
};

export const getCargoPerformance = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<OperatorPerformanceResponse>(
    `admin/operators/${id}/performance`,
  );
  return response.data;
};

export const getCargoTripsStats = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<TripStatsResponse>(
    `admin/operators/${id}/trips/stats`,
  );
  return response.data;
};

export const getCargoTripsList = async (id: string, params?: TripsParams) => {
  const response = await axiosInstanceWithAuth.get<SingleDriverTrips>(
    `admin/operators/${id}/trips?service_type=TRUCK`,
    { params },
  );
  return response.data;
};

export const getCargoEarning = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<EarningsOverviewResponse>(
    `admin/operators/${id}/earnings/stats`,
  );
  return response.data;
};

export const getCargoEarningList = async (id: string, params?: TripsParams) => {
  const response = await axiosInstanceWithAuth.get<OperatorEarningsResponse>(
    `admin/operators/${id}/earnings`,
    { params },
  );
  return response.data;
};

export const rejectCargoDocument = async (id: string, doc_id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/documents/${doc_id}/reject`,
  );
  return response.data;
};

export const approveCargoDocument = async (id: string, doc_id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/documents/${doc_id}/approve`,
  );
  return response.data;
};

export const getCargoTrips = async (params?: GetTripsParams) => {
  const response = await axiosInstanceWithAuth.get<TripsListResponse>(
    "admin/trips?service_type=TRUCK",
    { params },
  );
  return response.data;
};

export const getCargoTripStat = async () => {
  const response = await axiosInstanceWithAuth.get<TripStatResponse>(
    "admin/trips/stats?service_type=TRUCK",
  );
  return response.data;
};

export const getAvailableCargoOperatorsForTrip = async ({
  booking_id = "",
}: {
  booking_id?: string;
}) => {
  const response = await axiosInstanceWithAuth.get(
    "admin/trips/available-operators?service_type=TRUCK",
    {
      params: { booking_id },
    },
  );
  return response.data;
};
