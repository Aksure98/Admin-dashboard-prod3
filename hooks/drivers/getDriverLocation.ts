import { driverLocationList } from "@/api/drivers";
import { useQuery } from "@tanstack/react-query";

export const useGetDriverLocationList = (params: {
  service_type?: string;
  availability_status: string;
}) => {
  return useQuery({
    queryKey: ["driver-location-list", params],
    queryFn: () => driverLocationList(params),
  });
};
