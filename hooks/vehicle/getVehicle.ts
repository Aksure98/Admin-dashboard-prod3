import { VehicleParams } from "@/@types";
import { getVehicleCategory } from "@/api/vehicle";
import { useQuery } from "@tanstack/react-query";

export const useGetVehicleCategory = (params?: VehicleParams) => {
  return useQuery({
    queryKey: ["vehicle-categories", params],
    queryFn: () => getVehicleCategory(params),
  });
};
