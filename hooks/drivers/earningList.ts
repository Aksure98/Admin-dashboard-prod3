import { TripsParams } from "@/@types";
import { getEarningList } from "@/api/drivers";
import { useQuery } from "@tanstack/react-query";

export const useGetEarningList = (id: string, params?: TripsParams) => {
  return useQuery({
    queryKey: ["drivers-earning", id, params],
    queryFn: () => getEarningList(id, params),
  });
};
