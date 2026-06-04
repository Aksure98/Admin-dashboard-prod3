import { useQuery } from "@tanstack/react-query";
import { getDriversStat } from "@/api/drivers";

export const useGetDriverStat = (params?: {
  service_type?: string;
  state?: string;
}) => {
  return useQuery({
    queryKey: ["driver-stat", params],
    queryFn: () => getDriversStat(params),
  });
};
