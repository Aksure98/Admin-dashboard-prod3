import { getCustomerTripStat } from "@/api/customer";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerTripStat = (id: string) => {
  return useQuery({
    queryKey: ["customer-trip-stats", id],
    queryFn: () => getCustomerTripStat(id),
    enabled: !!id,
  });
};
