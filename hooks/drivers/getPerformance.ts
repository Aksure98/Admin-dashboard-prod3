import { useQuery } from "@tanstack/react-query";
import { getPerformance } from "@/api/drivers";

export const useGetPerformance = (id: string) => {
  return useQuery({
    queryKey: ["driver-performance", id],
    queryFn: () => getPerformance(id),
  });
};
