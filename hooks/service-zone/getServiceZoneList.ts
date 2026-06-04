import { ServiceZoneParams } from "@/@types";
import { getServiceZoneList } from "@/api/service-zone";
import { useQuery } from "@tanstack/react-query";

export const useGetServiceZoneList = (params?: ServiceZoneParams) => {
  return useQuery({
    queryKey: ["service-zones", params],
    queryFn: () => getServiceZoneList(params),
  });
};
