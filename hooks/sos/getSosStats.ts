import { getSosStats } from "@/api/sos";
import { useQuery } from "@tanstack/react-query";

export const useGetSosStats = (state: string) => {
  return useQuery({
    queryKey: ["sos-stats", state],
    queryFn: () => getSosStats(state),
  });
};
