import { useQuery } from "@tanstack/react-query";
import { getCargoStat } from "@/api/freight-cargo";

export const useGetCargoOperatorStat = () => {
  return useQuery({
    queryKey: ["cargo-operator-stat"],
    queryFn: getCargoStat,
  });
};

export const useGetCargoStat = useGetCargoOperatorStat;
