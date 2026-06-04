import { TripsParams } from "@/@types";
import { getTowTripsList } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTowTripList = (id: string, params?: TripsParams) => {
  return useQuery({
    queryKey: ["tow-trips", id, params],
    queryFn: () => getTowTripsList(id, params),
  });
};
