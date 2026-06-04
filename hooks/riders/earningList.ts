import { TripsParams } from "@/@types";
import { getEarningList } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useGetEarningList = (id: string, params?: TripsParams) => {
  return useQuery({
    queryKey: ["riders-earning", id, params],
    queryFn: () => getEarningList(id, params),
  });
};
