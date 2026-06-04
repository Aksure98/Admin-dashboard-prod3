import { GetTripsParams } from "@/@types";
import { getTrips } from "@/api/trips";
import { useQuery } from "@tanstack/react-query";

export const useGetTrips = (params?: GetTripsParams) => {
  return useQuery({
    queryKey: ["trips", params],
    queryFn: () => getTrips(params),
  });
};
