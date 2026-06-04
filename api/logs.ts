import { ActivityLogResponse, GetLogsParams } from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getLogs = async (params?: GetLogsParams) => {
  const response = await axiosInstanceWithAuth.get<ActivityLogResponse>(
    "admin/activity-logs",
    { params },
  );
  return response.data;
};
