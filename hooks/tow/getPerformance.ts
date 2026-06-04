import { getTowPerformance } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTowPerformance = (id: string) => {
  return useQuery({
    queryKey: ["tow-performance", id],
    queryFn: () => getTowPerformance(id),
  });
};
