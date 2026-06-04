import {
  GetNotificationTemplatesParams,
  NotificationTemplatePayload,
  NotificationTemplateResponse,
  NotificationTemplate,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getNotificationTemplates = async (
  params: GetNotificationTemplatesParams = {},
) => {
  const response = await axiosInstanceWithAuth.get<NotificationTemplateResponse>(
    "admin/notifications/templates",
    {
      params,
    },
  );
  return response.data;
};

export const addNotificationTemplate = async (
  payload: NotificationTemplatePayload,
) => {
  const response = await axiosInstanceWithAuth.post<ApiResponse<NotificationTemplate>>(
    "admin/notifications/templates",
    payload,
  );
  return response.data;
};

export const editNotificationTemplate = async (
  id: string,
  payload: NotificationTemplatePayload,
) => {
  const response = await axiosInstanceWithAuth.patch<ApiResponse<NotificationTemplate>>(
    `admin/notifications/templates/${id}`,
    payload,
  );
  return response.data;
};

export const deleteNotificationTemplate = async (id: string) => {
  const response = await axiosInstanceWithAuth.delete<ApiResponse<NotificationTemplate>>(
    `admin/notifications/templates/${id}`,
  );
  return response.data;
};

export const bulkDeleteNotificationTemplates = async (ids: string[]) => {
  const response = await axiosInstanceWithAuth.delete<ApiResponse<null>>(
    "admin/notifications/templates/bulk-delete",
    { data: { ids } },
  );
  return response.data;
};

export const exportNotificationTemplates = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(`admin/notifications/templates/export`, {
    params: { format: typeMap[format] ?? format },
    responseType: "blob",
  });
  return response.data;
};
