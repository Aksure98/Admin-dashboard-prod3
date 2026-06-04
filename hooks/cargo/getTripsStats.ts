import { getCargoTripsStats } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargoTripStats = (id: string) => {
  return useQuery({
    queryKey: ["cargo-trips-stats", id],
    queryFn: () => getCargoTripsStats(id),
  });
};
