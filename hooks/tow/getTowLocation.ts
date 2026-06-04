import { towLocationList } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTowLocationList = (availability_status: string) => {
  return useQuery({
    queryKey: ["tow-location-list", availability_status],
    queryFn: () => towLocationList(availability_status),
  });
};
