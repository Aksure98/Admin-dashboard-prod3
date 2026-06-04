import { getTowEarning } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTowEarning = (id: string) => {
  return useQuery({
    queryKey: ["tow-earning", id],
    queryFn: () => getTowEarning(id),
  });
};
