import { getVehicle } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useGetVehicle = (id: string) => {
  return useQuery({
    queryKey: ["rider-vehicle", id],
    queryFn: () => getVehicle(id),
  });
};
