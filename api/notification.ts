import {
  NotificationTemplatePayload,
  NotificationTemplate,
  NotificationInboxResponse,
  NotificationInboxPayload,
  NotificationInbox,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getNotificationInbox = async (
  params: NotificationInboxPayload,
) => {
  const response = await axiosInstanceWithAuth.get<NotificationInboxResponse>(
    "admin/notifications",
    {
      params,
    },
  );
  return response.data;
};

export const deleteNotificationInbox = async () => {
  const response = await axiosInstanceWithAuth.delete<ApiResponse<null>>(
    "admin/notifications",
  );
  return response.data;
};

export const markNotificationInboxAsRead = async (id: string) => {
  const response = await axiosInstanceWithAuth.patch<ApiResponse<NotificationInbox>>(
    `admin/notifications/${id}/read`,
  );
  return response.data;
};

export const markAllNotificationInboxAsRead = async () => {
  const response = await axiosInstanceWithAuth.post<ApiResponse<null>>(
    "admin/notifications/mark-all-read",
  );
  return response.data;
};

