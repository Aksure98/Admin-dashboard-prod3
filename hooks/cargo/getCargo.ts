import { GetTripsParams } from "@/@types";
import { getCargoTrips } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargo = (params?: GetTripsParams) => {
  return useQuery({
    queryKey: ["cargo", params],
    queryFn: () => getCargoTrips(params),
  });
};
