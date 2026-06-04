import { getServiceZoneStat } from "@/api/service-zone";
import { useQuery } from "@tanstack/react-query";

export const useGetZoneStat = () => {
  return useQuery({
    queryKey: ["zone-stat"],
    queryFn: getServiceZoneStat,
  });
};
