import { getSingleCargo } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleCargo = (id: string) => {
  return useQuery({
    queryKey: ["single-cargo", id],
    queryFn: () => getSingleCargo(id),
    enabled: !!id,
  });
};
