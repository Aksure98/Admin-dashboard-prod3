import { getRecentActivities } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useRecentActivities = () => {
  return useQuery({
    queryKey: ["recent-activities"],
    queryFn: getRecentActivities,
  });
};
