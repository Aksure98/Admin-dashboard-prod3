import { getCargoVehicle } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargoVehicle = (id: string) => {
  return useQuery({
    queryKey: ["cargo-vehicle", id],
    queryFn: () => getCargoVehicle(id),
  });
};
