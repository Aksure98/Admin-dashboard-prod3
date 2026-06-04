import { getSingleDriver } from "@/api/drivers";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleDriver = (id: string) => {
  return useQuery({
    queryKey: ["single-driver", id],
    queryFn: () => getSingleDriver(id),
    enabled: !!id,
  });
};
