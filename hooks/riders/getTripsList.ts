import { TripsParams } from "@/@types";
import { getTripsList } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useGetTripList = (id: string, params?: TripsParams) => {
  return useQuery({
    queryKey: ["riders-trips", id, params],
    queryFn: () => getTripsList(id, params),
  });
};
