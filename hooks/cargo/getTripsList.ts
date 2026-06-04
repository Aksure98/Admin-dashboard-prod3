import { TripsParams } from "@/@types";
import { getCargoTripsList } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargoTripList = (id: string, params?: TripsParams) => {
  return useQuery({
    queryKey: ["cargo-trips", id, params],
    queryFn: () => getCargoTripsList(id, params),
  });
};
