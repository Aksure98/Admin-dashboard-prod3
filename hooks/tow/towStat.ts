import { getTowTripStat } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTowStat = () => {
  return useQuery({
    queryKey: ["tow-stat"],
    queryFn: getTowTripStat,
  });
};
