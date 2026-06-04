import { useQuery } from "@tanstack/react-query";
import { getAvailableTowOperatorsForTrip } from "@/api/tow";

export const useGetAvailableTowOperator = (booking_id?: string) => {
  return useQuery({
    queryKey: ["available-tow", booking_id],
    queryFn: () =>
      getAvailableTowOperatorsForTrip({ booking_id: booking_id ?? "" }),
  });
};
