import { GetDriverParams } from "@/@types";
import { getDriversList } from "@/api/drivers";
import { useQuery } from "@tanstack/react-query";

export const useGetDriver = (params: GetDriverParams = {}) => {
  return useQuery({
    queryKey: ["drivers", params],
    queryFn: () => getDriversList(params),
  });
};
