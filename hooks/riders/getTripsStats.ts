import { getTripsStats } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useGetTripStats = (id: string) => {
  return useQuery({
    queryKey: ["rider-trips-stats", id],
    queryFn: () => getTripsStats(id),
  });
};
