import {
  GetPushNotificationsParams,
  SendPushNotificationPayload,
  PushNotificationResponse,
  SendPushNotificationResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getPushNotifications = async (
  params: GetPushNotificationsParams = {},
) => {
  const response = await axiosInstanceWithAuth.get<PushNotificationResponse>(
    "admin/notifications/broadcasts",
    {
      params,
    },
  );
  return response.data;
};

export const sendPushNotification = async (
  payload: SendPushNotificationPayload,
) => {
    console.log(payload)
  const response = await axiosInstanceWithAuth.post<
    ApiResponse<SendPushNotificationResponse>
  >("admin/notifications/broadcasts", payload);
  return response.data;
};

export const bulkDeletePushNotifications = async (ids: string[]) => {
  const response = await axiosInstanceWithAuth.delete<ApiResponse<null>>(
    "admin/notifications/broadcasts/bulk-delete",
    { data: { ids } },
  );
  return response.data;
};

export const exportPushNotifications = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(`admin/notifications/broadcasts/export`, {
    params: { format: typeMap[format] ?? format },
    responseType: "blob",
  });
  return response.data;
};
