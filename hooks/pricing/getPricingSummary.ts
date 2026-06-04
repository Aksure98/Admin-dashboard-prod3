import { getPricingSummary } from "@/api/pricing";
import { useQuery } from "@tanstack/react-query";

export const useGetPricingSummary = () => {
  return useQuery({
    queryKey: ["pricing-summary"],
    queryFn: () => getPricingSummary(),
  });
};
