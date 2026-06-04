import { riderLocationList } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useGetRiderLocationList = (availability_status: string) => {
  return useQuery({
    queryKey: ["rider-location-list", availability_status],
    queryFn: () => riderLocationList(availability_status),
  });
};
