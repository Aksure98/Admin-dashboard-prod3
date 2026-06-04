import { useQuery } from "@tanstack/react-query";
import { getAvailableDrivers } from "@/api/trips";

export const useGetAvailableDrivers = (booking_id?: string) => {
  return useQuery({
    queryKey: ["available-drivers", booking_id],
    queryFn: () => getAvailableDrivers({ booking_id: booking_id ?? "" }),
  });
};
