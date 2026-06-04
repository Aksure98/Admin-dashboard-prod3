import { useQuery } from "@tanstack/react-query";
import { getVehicle } from "@/api/drivers";

export const useGetVehicle = (id: string) => {
  return useQuery({
    queryKey: ["driver-vehicle", id],
    queryFn: () => getVehicle(id),
  });
};
