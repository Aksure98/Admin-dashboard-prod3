import { getPerformance } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useGetPerformance = (id: string) => {
  return useQuery({
    queryKey: ["rider-performance", id],
    queryFn: () => getPerformance(id),
  });
};
