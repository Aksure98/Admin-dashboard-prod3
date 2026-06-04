import { useQuery } from "@tanstack/react-query";
import { getTeamStat } from "@/api/team";

export const useGetTeamStat = () => {
  return useQuery({
    queryKey: ["stat-teams"],
    queryFn: getTeamStat,
  });
};
