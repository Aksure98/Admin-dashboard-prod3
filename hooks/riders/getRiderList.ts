import { GetDriverParams } from "@/@types";
import { getRidersList } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useGetRiders = (params: GetDriverParams = {}) => {
  return useQuery({
    queryKey: ["riders", params],
    queryFn: () => getRidersList(params),
  });
};
