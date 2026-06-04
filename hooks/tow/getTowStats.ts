import { useQuery } from "@tanstack/react-query";
import { getTowStat } from "@/api/tow";

export const useGetTowOperatorStat = () => {
  return useQuery({
    queryKey: ["tow-operator-stat"],
    queryFn: getTowStat,
  });
};

export const useGetTowStat = useGetTowOperatorStat;
