import { useQuery } from "@tanstack/react-query";
import { getTripsStat } from "@/api/trips";

export const useGetTripsStat = (params?: {
  service_type?: string;
  state?: string;
}) => {
  return useQuery({
    queryKey: ["trips-stats", params],
    queryFn: () => getTripsStat(params),
  });
};
