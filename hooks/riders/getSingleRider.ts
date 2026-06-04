import { getSingleRider } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleRider = (id: string) => {
  return useQuery({
    queryKey: ["single-rider", id],
    queryFn: () => getSingleRider(id),
    enabled: !!id,
  });
};
