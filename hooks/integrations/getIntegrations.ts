import { GetLogsParams } from "@/@types";
import { getIntegrations } from "@/api/integration";
import { useQuery } from "@tanstack/react-query";

export const useGetIntegrations = (params?: GetLogsParams) => {
  return useQuery({
    queryKey: ["integrations", params],
    queryFn: () => getIntegrations(params),
  });
};
