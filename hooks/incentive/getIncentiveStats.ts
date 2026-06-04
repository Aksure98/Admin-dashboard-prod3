import { useQuery } from "@tanstack/react-query";
import { getIncentiveStats } from "@/api/incentive";

export const useGetIncentiveStats = () => {
  return useQuery({
    queryKey: ["incentive-stats"],
    queryFn: getIncentiveStats,
  });
};
