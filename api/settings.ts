import {
  GeneralSettingsResponse,
  NotificationSettingsResponse,
  UpdateSettingsProps,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getSettings = async () => {
  const response = await axiosInstanceWithAuth.get<GeneralSettingsResponse>(
    "admin/settings/general",
  );
  return response.data;
};

export const updateSettings = async (data: UpdateSettingsProps) => {
  const response = await axiosInstanceWithAuth.put<GeneralSettingsResponse>(
    "admin/settings/general",
    data,
  );
  return response.data;
};

export const updateLogo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstanceWithAuth.post<GeneralSettingsResponse>(
    "admin/settings/general/logo",
    formData,
  );
  return response.data;
};

export const updateFavicon = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstanceWithAuth.post<GeneralSettingsResponse>(
    "admin/settings/general/favicon",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const getNotificationSettings = async () => {
  const response =
    await axiosInstanceWithAuth.get<NotificationSettingsResponse>(
      "admin/settings/notifications",
    );
  return response.data;
};

export const updateNotificationSetting = async (
  event_type: string,
  data: {
    email_enabled: boolean;
    sms_enabled: boolean;
    push_enabled: boolean;
  },
) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/settings/notifications/${event_type}`,
    data,
  );
  return response.data;
};
