import { getCustomerTrip } from "@/api/customer";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerTrip = (id: string) => {
  return useQuery({
    queryKey: ["customer-trip", id],
    queryFn: () => getCustomerTrip(id),
    enabled: !!id,
  });
};
