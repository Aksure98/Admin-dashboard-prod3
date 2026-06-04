import { useQuery } from "@tanstack/react-query";
import { getAvailableDelivery } from "@/api/delivery";

export const useGetAvailableDeliveryOperator = (booking_id?: string) => {
  return useQuery({
    queryKey: ["available-delivery", booking_id],
    queryFn: () => getAvailableDelivery({ booking_id: booking_id ?? "" }),
  });
};
