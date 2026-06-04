import {
  AddIncentiveResponse,
  CouponListResponse,
  GetCouponsParams,
  IncentiveListResponse,
  IncentiveStatsResponse,
  SingleIncentiveResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getIncentiveStats = async () => {
  const response = await axiosInstanceWithAuth.get<IncentiveStatsResponse>(
    "admin/promotions/incentives/stats",
  );
  return response.data;
};

export const exportIncentiveList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    `admin/promotions/incentives/export`,
    {
      params: { format: typeMap[format] ?? format },
      responseType: "blob",
    },
  );
  return response.data;
};

export const getIncentiveList = async (params?: GetCouponsParams) => {
  const response = await axiosInstanceWithAuth.get<IncentiveListResponse>(
    "admin/promotions/incentives",
    { params },
  );
  return response.data;
};

export const toggleStatus = async (
  id: string,
  value: { is_active: boolean },
): Promise<CouponListResponse> => {
  const response = await axiosInstanceWithAuth.patch<CouponListResponse>(
    `admin/promotions/incentives/${id}/toggle`,
    value,
  );
  return response.data;
};

export const getSingleIncentive = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<SingleIncentiveResponse>(
    `admin/promotions/incentives/${id}`,
  );
  return response.data;
};

export const addIncentive = async (
  values: AddIncentiveResponse,
): Promise<IncentiveListResponse> => {
  const response = await axiosInstanceWithAuth.post<IncentiveListResponse>(
    "admin/promotions/incentives",
    values,
  );
  return response.data;
};

export const editIncentive = async (
  id: string,
  values: AddIncentiveResponse,
): Promise<IncentiveListResponse> => {
  const response = await axiosInstanceWithAuth.patch<IncentiveListResponse>(
    `admin/promotions/incentives/${id}`,
    values,
  );
  return response.data;
};
