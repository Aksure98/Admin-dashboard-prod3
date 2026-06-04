import { TripsParams } from "@/@types";
import { getCargoEarningList } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargoEarningList = (id: string, params?: TripsParams) => {
  return useQuery({
    queryKey: ["cargo-earnings", id, params],
    queryFn: () => getCargoEarningList(id, params),
  });
};
