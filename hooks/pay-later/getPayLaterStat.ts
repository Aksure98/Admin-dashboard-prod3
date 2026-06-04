import { getPayLaterStats } from "@/api/pay-later";
import { useQuery } from "@tanstack/react-query";

export const useGetPayLaterStats = () => {
  return useQuery({
    queryKey: ["payLater-stats"],
    queryFn: getPayLaterStats,
  });
};
