import { getTowVehicle } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTowVehicle = (id: string) => {
  return useQuery({
    queryKey: ["tow-vehicle", id],
    queryFn: () => getTowVehicle(id),
  });
};
