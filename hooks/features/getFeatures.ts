import { GetLogsParams } from "@/@types";
import { getFeatures } from "@/api/feature-toggle";
import { useQuery } from "@tanstack/react-query";

export const useGetFeatures = (params?: GetLogsParams) => {
  return useQuery({
    queryKey: ["features", params],
    queryFn: () => getFeatures(params),
  });
};
