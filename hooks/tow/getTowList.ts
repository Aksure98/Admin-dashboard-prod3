import { GetDriverParams } from "@/@types";
import { getTowList } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTowList = (params: GetDriverParams = {}) => {
  return useQuery({
    queryKey: ["tow-operators", params],
    queryFn: () => getTowList(params),
  });
};
