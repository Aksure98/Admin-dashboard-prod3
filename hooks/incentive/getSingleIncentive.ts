import { getSingleIncentive } from "@/api/incentive";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleIncentive = (id: string) => {
  return useQuery({
    queryKey: ["single-incentive", id],
    queryFn: () => getSingleIncentive(id),
    enabled: !!id,
  });
};
