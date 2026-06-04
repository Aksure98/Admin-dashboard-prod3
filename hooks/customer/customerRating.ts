import { useQuery } from "@tanstack/react-query";
import { getCustomerRating } from "@/api/customer";

export const useGetCustomerRating = (
  id: string,
  type: "GIVEN" | "RECEIVED",
) => {
  return useQuery({
    queryKey: ["customer-rating", id, type],
    queryFn: () => getCustomerRating(id, type),
    enabled: !!id,
  });
};
