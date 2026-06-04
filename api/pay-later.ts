import {
  GetPayLaterParams,
  PayLaterListResponse,
  PayLaterStatsResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getPayLaterStats = async () => {
  const response = await axiosInstanceWithAuth.get<PayLaterStatsResponse>(
    "admin/pay-later/stats",
  );
  return response.data;
};

export const exportPayLaterList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(`admin/pay-later/export`, {
    params: { format: typeMap[format] ?? format },
    responseType: "blob",
  });
  return response.data;
};

export const getPayLaterList = async (params?: GetPayLaterParams) => {
  const response = await axiosInstanceWithAuth.get<PayLaterListResponse>(
    "admin/pay-later",
    { params },
  );
  return response.data;
};

export const getSinglePayLater = async (id: string) => {
  const response = await axiosInstanceWithAuth.get(`admin/pay-later/${id}`);
  return response.data;
};

export const downloadPayLaterReceipt = async (id: string) => {
  const response = await axiosInstanceWithAuth.get(
    `admin/pay-later/${id}/receipt`,
  );
  return response.data;
};
export const markPayLaterAsPaid = async (id: string) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/pay-later/${id}/mark-paid`,
  );
  return response.data;
};
export const escalatePayLater = async (id: string) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/pay-later/${id}/escalate`,
  );
  return response.data;
};
export const sendPayLaterReminder = async (id: string) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/pay-later/${id}/send-reminder`,
  );
  return response.data;
};
