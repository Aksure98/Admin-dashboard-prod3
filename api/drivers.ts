import {
  AddDriverProps,
  ComposeNotificationsProps,
  DocumentResponseList,
  DriversDocumentParams,
  DriversWalletParams,
  EarningsOverviewResponse,
  EditProps,
  GetDriverParams,
  GetNotificationParams,
  NotificationResponse,
  OperatorEarningsResponse,
  OperatorMemberResponse,
  OperatorPerformanceResponse,
  OperatorResponseList,
  OperatorStatResponse,
  ServiceType,
  SingleDriverTrips,
  SingleOperatorResponse,
  TeamMemberResponse,
  TransactionListResponse,
  TripsParams,
  TripStatsResponse,
  VehicleInfoResponse,
  WalletResponseList,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getDriversStat = async (params?: {
  service_type?: string;
  state?: string;
}) => {
  const response = await axiosInstanceWithAuth.get<OperatorStatResponse>(
    "admin/operators/stats",
    { params },
  );
  return response.data;
};

export const getDriversList = async (params: GetDriverParams = {}) => {
  const {
    page = 1,
    limit = 20,
    search,
    verification_status,
    status,
    state,
    service_type,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));

  if (status && status !== "ALL") queryParams.set("status", status);
  if (search) queryParams.set("search", search);
  if (verification_status)
    queryParams.set("verification_status", verification_status);
  if (state) queryParams.set("state", state);
  if (service_type) queryParams.set("service_type", service_type);

  const response = await axiosInstanceWithAuth.get<
    ApiResponse<TeamMemberResponse>
  >(`admin/operators?${queryParams.toString()}`);

  return response.data;
};

export const editDriver = async (
  id: string,
  values: AddDriverProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.put<TeamMemberResponse>(
    `admin/operators/${id}`,
    values,
  );
  return response.data;
};
export const addDriver = async (
  values: AddDriverProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/RIDES`,
    values,
  );
  return response.data;
};

export const exportDriverList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    `admin/operators/RIDES/export`,
    {
      params: { format: typeMap[format] ?? format },
      responseType: "blob",
    },
  );
  return response.data;
};
export const driverLocationList = async (params: {
  service_type?: string;
  availability_status: string;
}) => {
  const response = await axiosInstanceWithAuth.get<OperatorResponseList>(
    `admin/operators/locations`,
    { params },
  );
  return response.data;
};

export const getDriversNotification = async (
  params?: GetNotificationParams,
) => {
  const response = await axiosInstanceWithAuth.get<NotificationResponse>(
    `admin/operators/notifications`,
    { params },
  );
  return response.data;
};

export const addNotification = async (
  // service_type: string,
  values: ComposeNotificationsProps,
): Promise<OperatorMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<OperatorMemberResponse>(
    `admin/operators/notifications`,
    values,
  );
  return response.data;
};

export const driversWallet = async (params?: DriversWalletParams) => {
  const response = await axiosInstanceWithAuth.get<WalletResponseList>(
    "admin/operators/wallets",
    { params },
  );
  return response.data;
};

export const exportDriversWalletList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    `admin/operators/wallets/export`,
    {
      params: { format: typeMap[format] ?? format },
      responseType: "blob",
    },
  );
  return response.data;
};

export const driversDocument = async (params?: DriversDocumentParams) => {
  const response = await axiosInstanceWithAuth.get<DocumentResponseList>(
    `admin/operators/documents`,
    { params },
  );
  return response.data;
};

export const getSingleDriver = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<SingleOperatorResponse>(
    `admin/operators/${id}`,
  );
  return response.data;
};

export const suspendDriver = async (
  id: string,
  payload: { reason: string; duration_days: number; message: string },
) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/suspend`,
    payload,
  );
  return response.data;
};

export const activateDriver = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/operators/${id}/activate`,
  );
  return response.data;
};

export const resetPasswordDriver = async (id: string) => {
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
    `admin/operators/${id}/trips`,
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

export const driverWalletDetails = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<TransactionListResponse>(
    `admin/operators/${id}/wallet/transactions`,
  );
  return response.data;
};

export const creditDriverWallet = async (
  id: string,
  data: { amount: string; reason: string },
) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/operators/${id}/wallet/credit`,
    data,
  );
  return response.data;
};
export const debitDriverWallet = async (
  id: string,
  data: { amount: string; reason: string },
) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/operators/${id}/wallet/debit`,
    data,
  );
  return response.data;
};
