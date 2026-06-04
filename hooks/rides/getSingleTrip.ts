import { getSingleTrip } from "@/api/trips";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleRides = (id: string) => {
  return useQuery({
    queryKey: ["single-trips", id],
    queryFn: () => getSingleTrip(id),
    enabled: !!id,
  });
};
