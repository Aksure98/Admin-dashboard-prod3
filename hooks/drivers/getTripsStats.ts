import { useQuery } from "@tanstack/react-query";
import { getTripsStats } from "@/api/drivers";

export const useGetTripStats = (id: string) => {
  return useQuery({
    queryKey: ["driver-trips-stat", id],
    queryFn: () => getTripsStats(id),
  });
};
