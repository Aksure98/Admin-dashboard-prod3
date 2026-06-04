import {
  GetTransactionsParams,
  TransactionListResponse,
  TransactionStatsResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getTransactionStats = async () => {
  const response = await axiosInstanceWithAuth.get<TransactionStatsResponse>(
    "admin/transactions/stats",
  );
  return response.data;
};

export const getTransactionList = async (params: GetTransactionsParams) => {
  const response = await axiosInstanceWithAuth.get<TransactionListResponse>(
    "admin/transactions",
    { params },
  );
  return response.data;
};

export const getSingleTransaction = async (id: string) => {
  const response = await axiosInstanceWithAuth.get(`admin/transactions/${id}`);
  return response.data;
};
export const refundTransaction = async (id: string, reason: string) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/transactions/${id}/refund`,
    { reason },
  );
  return response.data;
};
export const retryPayout = async (id: string) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/transactions/${id}/retry-payout`,
  );
  return response.data;
};
export const resolveTransaction = async (
  id: string,
  resolution_note: string,
) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/transactions/${id}/resolve`,
    { resolution_note },
  );
  return response.data;
};
export const downloadTransaction = async (id: string) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/transactions/${id}/receipt`,
  );
  return response.data;
};
