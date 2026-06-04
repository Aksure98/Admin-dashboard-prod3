import { getCargoTripStat } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargoStat = () => {
  return useQuery({
    queryKey: ["cargo-stat"],
    queryFn: getCargoTripStat,
  });
};
