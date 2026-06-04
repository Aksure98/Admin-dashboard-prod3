import { GetTripsParams } from "@/@types";
import { getTowTrips } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTow = (params?: GetTripsParams) => {
  return useQuery({
    queryKey: ["tow", params],
    queryFn: () => getTowTrips(params),
  });
};
