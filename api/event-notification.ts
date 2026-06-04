import {
  GetEventNotificationsParams,
  SendEventNotificationPayload,
  EventNotificationPayload,
  UpdateEventNotificationPayload,
  ToggleEventNotificationPayload,
  EventNotification,
  EventNotificationResponse,
  SendEventNotificationResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getEventNotifications = async (
  params: GetEventNotificationsParams = {},
) => {
  const response = await axiosInstanceWithAuth.get<EventNotificationResponse>(
    "admin/notifications/automated",
    {
      params,
    },
  );
  return response.data;
};

export const sendEventNotification = async (
  payload: SendEventNotificationPayload,
) => {
  const response = await axiosInstanceWithAuth.post<
    ApiResponse<SendEventNotificationResponse>
  >("admin/notifications/automated", payload);
  return response.data;
};

export const updateEventNotification = async (
  id: string,
  payload: Partial<UpdateEventNotificationPayload>,
) => {
  const response = await axiosInstanceWithAuth.patch<ApiResponse<EventNotification>>(
    `admin/notifications/automated/${id}`,
    payload,
  );
  return response.data;
};

export const toggleEventNotificationStatus = async (
  id: string,
  payload: ToggleEventNotificationPayload,
) => {
  const response = await axiosInstanceWithAuth.patch<ApiResponse<EventNotification>>(
    `admin/notifications/automated/${id}/toggle`,
    payload,
  );
  return response.data;
};

export const bulkDeleteEventNotifications = async (ids: string[]) => {
  const response = await axiosInstanceWithAuth.delete<ApiResponse<null>>(
    "admin/notifications/automated/bulk-delete",
    {
      data: {
        ids,
      },
    },
  );
  return response.data;
};

export const exportEventNotifications = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(`admin/notifications/automated/export`, {
    params: { format: typeMap[format] ?? format },
    responseType: "blob",
  });
  return response.data;
};
