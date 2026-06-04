import { SOSAlertsResponse, SosParams, SOSStatsResponse } from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getSosStats = async (state: string) => {
  const response = await axiosInstanceWithAuth.get<SOSStatsResponse>(
    `admin/sos/stats?state=${state}`,
  );
  return response.data;
};

export const getSosList = async (params?: SosParams) => {
  const response = await axiosInstanceWithAuth.get<SOSAlertsResponse>(
    `admin/sos`,
    {
      params,
    },
  );
  return response.data;
};

export const exportSosList = async (
  format: string,
  state?: string,
  period?: string,
) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(`admin/sos/export`, {
    params: {
      format: typeMap[format] ?? format,
      state: state === "All States" ? undefined : state,
      period,
    },
    responseType: "blob",
  });
  return response.data;
};
