import { GetLogsParams, FeatureToggleResponse } from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getFeatures = async (params?: GetLogsParams) => {
  const response = await axiosInstanceWithAuth.get<FeatureToggleResponse>(
    "admin/settings/features",
    { params },
  );
  return response.data;
};

export const toggleFeatureStatus = async (
  id: string,
  value: { is_active: boolean },
): Promise<FeatureToggleResponse> => {
  const response = await axiosInstanceWithAuth.patch<FeatureToggleResponse>(
    `admin/settings/features/${id}`,
    value,
  );
  return response.data;
};
