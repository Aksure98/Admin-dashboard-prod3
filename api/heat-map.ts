import {
  Demands,
  BackendAreaRecord,
  BackendHeatPointRecord,
  HeatMapAreasParams,
  HeatMapAreasResponse,
  HeatMapData,
  HeatMapParams,
  HeatMapResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

const normalizeHeatMapPoint = (
  point: BackendHeatPointRecord,
  index: number,
) => ({
  id: `${point.lat}-${point.lng}-${index}`,
  latitude: Number(point.lat),
  longitude: Number(point.lng),
  count: Number(point.count ?? 0),
});

const getTrendPercentage = (
  requests: number,
  priorRequests: number,
) => {
  if (!priorRequests) {
    return requests > 0 ? 100 : 0;
  }

  return Math.round(((requests - priorRequests) / priorRequests) * 100);
};

const getDemandStatus = (trend: number): Demands["status"] => {
  if (trend > 0) {
    return "high";
  }

  if (trend < 0) {
    return "low";
  }

  return "medium";
};

const normalizeArea = (
  area: BackendAreaRecord,
  index: number,
): Demands => {
  const requests = Number(area.requests ?? 0);
  const priorRequests = Number(area.prior_requests ?? 0);
  const trend = getTrendPercentage(requests, priorRequests);

  return {
    id: `${area.zone_name}-${area.city}-${area.state}-${index}`,
    zone: area.zone_name,
    city: area.city,
    state: area.state,
    requests,
    trend,
    status: getDemandStatus(trend),
  };
};

const normalizeHeatMapPayload = (
  payload?: HeatMapResponse["data"],
): HeatMapData => ({
  points: (payload?.heat_points ?? []).map(normalizeHeatMapPoint),
  areas: (payload?.areas ?? []).map(normalizeArea),
  period_label: payload?.period_label ?? "",
  prior_label: payload?.prior_label ?? "",
  total_requests: Number(payload?.total_requests ?? 0),
});

export const getHeatMap = async (
  params: HeatMapParams = {},
): Promise<ApiResponse<HeatMapData>> => {
  const response = await axiosInstanceWithAuth.get<HeatMapResponse>(
    "admin/heatmap",
    { params },
  );

  return {
    ...response.data,
    data: normalizeHeatMapPayload(response.data.data),
    status:
    "status" in response.data && typeof response.data.status === "string"
    ? response.data.status
    : "success",
    message: response.data.message,
  };
};

export const getHeatMapAreas = async (
  params: HeatMapAreasParams = {},
): Promise<ApiResponse<Demands[]>> => {
  const response = await axiosInstanceWithAuth.get<HeatMapAreasResponse>(
    "admin/heatmap/areas",
    { params },
  );

  return {
    status:
      "status" in response.data && typeof response.data.status === "string"
        ? response.data.status
        : "success",
    message: response.data.message,
    data: (response.data.data?.areas ?? []).map(normalizeArea),
  };
};

export const exportHeatMapAreas = async (
  format: string,
  params: Omit<HeatMapAreasParams, "tab"> = {},
) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    excel: "excel",
  };

  const response = await axiosInstanceWithAuth.get(
    "admin/heatmap/export",
    {
      params: {
        ...params,
        format: typeMap[format] ?? format,
      },
      responseType: "blob",
    },
  );

  return response.data;
};
