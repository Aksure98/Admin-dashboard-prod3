import { TripsParams } from "@/@types";
import { getTripsList } from "@/api/drivers";
import { useQuery } from "@tanstack/react-query";

export const useGetTripList = (id: string, params?: TripsParams) => {
  return useQuery({
    queryKey: ["drivers-trips", id, params],
    queryFn: () => getTripsList(id, params),
  });
};
