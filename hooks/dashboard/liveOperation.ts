import { getLiveOperations } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetLiveOperations = () => {
  return useQuery({
    queryKey: ["live-operations"],
    queryFn: getLiveOperations,
  });
};
