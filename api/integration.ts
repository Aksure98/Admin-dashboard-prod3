import { GetLogsParams, IntegrationResponse } from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getIntegrations = async (params?: GetLogsParams) => {
  const response = await axiosInstanceWithAuth.get<IntegrationResponse>(
    "admin/settings/integrations",
    { params },
  );
  return response.data;
};

export const toggleIntegrationStatus = async (
  id: string,
  value: { is_active: boolean },
): Promise<IntegrationResponse> => {
  const response = await axiosInstanceWithAuth.patch<IntegrationResponse>(
    `admin/settings/integrations/${id}`,
    value,
  );
  return response.data;
};
