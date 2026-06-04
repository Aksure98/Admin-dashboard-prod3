import {
  DashboardNotificationResponse,
  DashboardStatResponse,
  LiveOperations,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getDashboardStat = async ({
  period = "today",
  service_type = "string",
  state = "string",
} = {}) => {
  const response = await axiosInstanceWithAuth.get<DashboardStatResponse>(
    "admin/dashboard/stats",
    {
      params: { period, state, service_type },
    },
  );
  return response.data;
};

export const getLiveOperations = async () => {
  const response = await axiosInstanceWithAuth.get<LiveOperations>(
    "admin/dashboard/live-operations",
  );
  return response.data;
};

export const getRevenueOverview = async ({
  year = new Date().getFullYear(),
  service_type,
}: {
  year?: number;
  service_type?: string;
} = {}) => {
  const response = await axiosInstanceWithAuth.get(
    "admin/dashboard/revenue-overview",
    {
      params: { year, service_type },
    },
  );
  return response.data;
};

export const getRecentActivities = async () => {
  const response =
    await axiosInstanceWithAuth.get<DashboardNotificationResponse>(
      "admin/dashboard/recent-activities?limit=20",
    );
  return response.data;
};

export const getTopPerformer = async ({ sort_by = "" } = {}) => {
  const response = await axiosInstanceWithAuth.get(
    "admin/dashboard/top-performers",
    {
      params: { sort_by },
    },
  );
  return response.data;
};
