import { getCargoEarning } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargoEarning = (id: string) => {
  return useQuery({
    queryKey: ["cargo-earning", id],
    queryFn: () => getCargoEarning(id),
  });
};
