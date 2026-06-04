import { useQuery } from "@tanstack/react-query";
import { getAvailableCargoOperatorsForTrip } from "@/api/freight-cargo";

export const useGetAvailableCargoOperator = (booking_id?: string) => {
  return useQuery({
    queryKey: ["available-cargo", booking_id],
    queryFn: () =>
      getAvailableCargoOperatorsForTrip({ booking_id: booking_id ?? "" }),
  });
};

export const useGetAvailableTowOperator = useGetAvailableCargoOperator;
