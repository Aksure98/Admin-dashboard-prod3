import { getPricingTiers } from "@/api/pricing";
import { useQuery } from "@tanstack/react-query";

export const useGetPricingTiers = () => {
  return useQuery({
    queryKey: ["pricing-tiers"],
    queryFn: () => getPricingTiers(),
  });
};
