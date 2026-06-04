import { GetDriverParams } from "@/@types";
import { getCargoList } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargoList = (params: GetDriverParams = {}) => {
  return useQuery({
    queryKey: ["cargo-operators", params],
    queryFn: () => getCargoList(params),
  });
};
