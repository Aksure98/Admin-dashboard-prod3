import { useQuery } from "@tanstack/react-query";
import { getTransactionStats } from "@/api/transactions";

export const useGetTransactionStats = () => {
  return useQuery({
    queryKey: ["transaction-stats"],
    queryFn: getTransactionStats,
  });
};
