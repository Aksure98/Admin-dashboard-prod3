import { getCargoPerformance } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargoPerformance = (id: string) => {
  return useQuery({
    queryKey: ["cargo-performance", id],
    queryFn: () => getCargoPerformance(id),
  });
};
