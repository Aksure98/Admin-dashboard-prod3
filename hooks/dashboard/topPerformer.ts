import { getTopPerformer } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useTopPerformer = ({ sort_by = "" } = {}) => {
  return useQuery({
    queryKey: ["top-performers", sort_by],
    queryFn: () => getTopPerformer({ sort_by }),
  });
};
