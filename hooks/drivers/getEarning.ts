import { useQuery } from "@tanstack/react-query";
import { getEarning } from "@/api/drivers";

export const useGetEarning = (id: string) => {
  return useQuery({
    queryKey: ["driver-earning", id],
    queryFn: () => getEarning(id),
  });
};
