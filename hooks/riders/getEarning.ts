import { getEarning } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useGetEarning = (id: string) => {
  return useQuery({
    queryKey: ["rider-earning", id],
    queryFn: () => getEarning(id),
  });
};
