import { TripsParams } from "@/@types";
import { getTowEarningList } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTowEarningList = (id: string, params?: TripsParams) => {
  return useQuery({
    queryKey: ["tow-earnings", id, params],
    queryFn: () => getTowEarningList(id, params),
  });
};
