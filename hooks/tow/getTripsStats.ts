import { getTowTripsStats } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTowTripStats = (id: string) => {
  return useQuery({
    queryKey: ["tow-trips-stats", id],
    queryFn: () => getTowTripsStats(id),
  });
};
